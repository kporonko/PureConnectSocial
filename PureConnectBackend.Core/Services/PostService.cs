using Microsoft.AspNetCore.SignalR;
using PureConnectBackend.Core.Hubs;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Services
{
    public class PostService : IPostService
    {
        private readonly IPostRepository _postRepository;
        private readonly IPostLikeRepository _postLikeRepository;
        private readonly IUserRepository _userRepository;
        private readonly IFollowRepository _followRepository;
        private readonly IHubContext<NotificationHub> _hubContext;

        public PostService(
            IPostRepository postRepository,
            IPostLikeRepository postLikeRepository,
            IUserRepository userRepository,
            IFollowRepository followRepository,
            IHubContext<NotificationHub> hubContext)
        {
            _postRepository = postRepository;
            _postLikeRepository = postLikeRepository;
            _userRepository = userRepository;
            _followRepository = followRepository;
            _hubContext = hubContext;
        }

        public async Task<HttpStatusCode> CreatePost(CreatePostRequest postInfo, User userFromJwt)
        {
            var user = await _userRepository.GetUserByEmailAsync(userFromJwt.Email);
            if (user == null)
                return HttpStatusCode.BadRequest;

            var post = new Post
            {
                CreatedAt = postInfo.CreatedAt,
                Description = postInfo.Description,
                Image = postInfo.Image,
                User = user,
                UserId = user.Id,
                PostLikes = new List<PostLike>(),
                PostComments = new List<PostComment>()
            };

            await _postRepository.AddAsync(post);
            await _postRepository.SaveChangesAsync();

            return HttpStatusCode.Created;
        }

        public async Task<HttpStatusCode> DeletePost(DeletePostRequest postInfo)
        {
            var post = await _postRepository.GetByIdAsync(postInfo.PostId);
            if (post == null)
                return HttpStatusCode.NotFound;

            // Получаем связанные лайки и комментарии для удаления
            var postLikes = await _postLikeRepository.FindAsync(pl => pl.PostId == post.Id);

            // Удаляем пост и связанные данные
            foreach (var like in postLikes)
            {
                await _postLikeRepository.DeleteAsync(like);
            }

            await _postRepository.DeleteAsync(post);
            await _postRepository.SaveChangesAsync();

            return HttpStatusCode.OK;
        }

        public async Task<HttpStatusCode> EditPost(EditPostInfoRequest postNewInfo)
        {
            var post = await _postRepository.GetByIdAsync(postNewInfo.PostId);
            if (post == null)
                return HttpStatusCode.NotFound;

            post.Description = postNewInfo.Description;
            await _postRepository.UpdateAsync(post);
            await _postRepository.SaveChangesAsync();

            return HttpStatusCode.OK;
        }

        public async Task<PostResponse> GetPost(User userFromJwt, int postId)
        {
            var post = await _postRepository.GetPostWithDetailsAsync(postId);
            if (post == null)
                return null;

            var responseValidator = await CheckForValidationGeProfile(userFromJwt, post.User);
            if (responseValidator != null)
                return responseValidator;

            return ConvertEntityObjectToPostDto(post, userFromJwt.Id);
        }

        public async Task<List<PostResponse>> GetPosts(User userFromJwt)
        {
            var posts = await _postRepository.GetUserPostsAsync(userFromJwt.Id);

            List<PostResponse> resPostsList = new();
            foreach (var post in posts)
            {
                var postDto = ConvertEntityObjectToPostDto(post, userFromJwt.Id);
                resPostsList.Add(postDto);
            }

            return resPostsList.OrderByDescending(x => x.CreatedAt).ToList();
        }

        public async Task<List<PostImageResponse>> GetPostsImages(User userFromJwt)
        {
            return await _postRepository.GetUserPostImagesAsync(userFromJwt.Id);
        }

        public async Task<List<PostResponse>> GetRecommendedPosts(User userFromJwt)
        {
            var user = await _userRepository.GetUserByEmailAsync(userFromJwt.Email);
            if (user == null)
                return new List<PostResponse>();

            var followers = await _followRepository.FindAsync(f => f.FollowerId == user.Id);
            List<PostResponse> resPostsList = new();

            foreach (var follower in followers)
            {
                var followeePosts = await _postRepository.GetUserRecentPostsAsync(follower.FolloweeId, 7);
                foreach (var post in followeePosts)
                {
                    resPostsList.Add(ConvertEntityObjectToPostDto(post, user.Id));
                }
            }

            return resPostsList.OrderByDescending(x => x.CreatedAt).Take(50).ToList();
        }

        public async Task<HttpStatusCode> LikePost(LikePostRequest likeInfo, User userFromJwt)
        {
            var user = await _userRepository.GetUserByEmailAsync(userFromJwt.Email);
            if (user == null)
                return HttpStatusCode.BadRequest;

            var post = await _postRepository.GetByIdAsync(likeInfo.PostId);
            if (post == null)
                return HttpStatusCode.BadRequest;

            var existingLike = await _postLikeRepository.GetPostLikeAsync(likeInfo.PostId, user.Id);
            if (existingLike != null)
                return HttpStatusCode.BadRequest;

            var postLike = new PostLike
            {
                CreatedAt = likeInfo.CreatedAt,
                PostId = post.Id,
                UserId = user.Id
            };

            await _postLikeRepository.AddAsync(postLike);
            await _postLikeRepository.SaveChangesAsync();

            string notificationMessage = $"Your post with ID {post.Id} was liked by user {user.UserName}.";
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", notificationMessage);

            return HttpStatusCode.OK;
        }

        public async Task<HttpStatusCode> UnlikePost(LikePostDeleteRequest likeInfo, User userFromJwt)
        {
            var user = await _userRepository.GetUserByEmailAsync(userFromJwt.Email);
            if (user == null)
                return HttpStatusCode.BadRequest;

            var postLike = await _postLikeRepository.GetPostLikeAsync(likeInfo.PostId, user.Id);
            if (postLike == null)
                return HttpStatusCode.BadRequest;

            await _postLikeRepository.DeleteAsync(postLike);
            await _postLikeRepository.SaveChangesAsync();

            return HttpStatusCode.OK;
        }

        public async Task<List<UserLikedPost>> GetUsersLikedPost(User userFromJwt, int postId)
        {
            var currentUser = await _userRepository.GetByIdAsync(userFromJwt.Id);
            if (currentUser == null)
                return new List<UserLikedPost>();

            var postLikes = await _postLikeRepository.GetPostLikesAsync(postId);

            List<UserLikedPost> usersLikedPost = new();
            foreach (var postLike in postLikes)
            {
                var likedUser = await _userRepository.GetByIdAsync(postLike.UserId);
                if (likedUser != null)
                {
                    var isFollowed = await _followRepository.GetFollowAsync(currentUser.Id, likedUser.Id) != null;

                    usersLikedPost.Add(new UserLikedPost
                    {
                        Id = likedUser.Id,
                        UserName = likedUser.UserName,
                        Avatar = likedUser.Avatar,
                        LastName = likedUser.LastName,
                        FirstName = likedUser.FirstName,
                        IsFollowed = isFollowed,
                        IsMe = currentUser.Id == likedUser.Id
                    });
                }
            }

            return usersLikedPost;
        }

        private PostResponse ConvertEntityObjectToPostDto(Post post, int myId)
        {
            PostResponse postResponse = new PostResponse
            {
                PostId = post.Id,
                Description = post.Description,
                Image = post.Image,
                CreatedAt = post.CreatedAt,
                Response = MyResponses.Ok,
                UserId = post.UserId,
                LikesCount = post.PostLikes?.Count ?? 0,
                CommentsCount = post.PostComments?.Count ?? 0,
                Avatar = post.User?.Avatar,
                Username = post.User?.UserName,
                FullName = $"{post.User?.FirstName} {post.User?.LastName}",
                IsLike = post.PostLikes?.Any(x => x.UserId == myId) ?? false,
                IsMine = post.User?.Id == myId,
                IsFollowedUser = _followRepository.GetFollowAsync(myId, post.UserId).Result != null
            };

            return postResponse;
        }

        public async Task<PostResponse> CheckForValidationGeProfile(User currUser, User requestedUser)
        {
            if (currUser.Role == "admin")
                return null;

            if (currUser == null || requestedUser == null)
                return new PostResponse() { Response = MyResponses.BadRequest };

            if (!requestedUser.IsOpenAcc)
            {
                var follow1 = await _followRepository.GetFollowAsync(currUser.Id, requestedUser.Id);
                var follow2 = await _followRepository.GetFollowAsync(requestedUser.Id, currUser.Id);

                if (follow1 == null || follow2 == null)
                {
                    return new PostResponse() { Response = MyResponses.ClosedAcc };
                }
            }

            return null;
        }
    }
}