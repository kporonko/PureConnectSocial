using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Extentions;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Data;
using PureConnectBackend.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Services
{
    public class PostService : IPostService
    {
        /// <summary>
        /// Entity Framework DbContext.
        /// </summary>
        private readonly ApplicationContext _context;

        public PostService(ApplicationContext context)
        {
            _context = context;
        }


        /// <summary>
        /// Creates new post.
        /// </summary>
        /// <param name="postInfo">Post DTO with post info.</param>
        /// <param name="userFromJwt">User object got from jwt token.</param>
        /// <returns>201 status code if post is created.</returns>
        public async Task<HttpStatusCode> CreatePost(CreatePostRequest postInfo, User userFromJwt)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == userFromJwt.Email);

            var post = ConvertPostDtoToPost(postInfo, user);
            await AddPostToContext(post);
            return HttpStatusCode.Created;
        }

        /// <summary>
        /// Deletes post from db.
        /// </summary>
        /// <param name="postInfo">Post dto object with post Id.</param>
        /// <returns>200 if post was deleted, 400 if smth went wrong.</returns>
        public async Task<HttpStatusCode> DeletePost(DeletePostRequest postInfo)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(x => x.Id == postInfo.PostId);
            if (post is null)
                return HttpStatusCode.NotFound;

            await DeletePostFromContext(post);
            return HttpStatusCode.OK;
        }

        /// <summary>
        /// Changes post description.
        /// </summary>
        /// <param name="postNewInfo">EditPostInfoRequest object with new description.</param>
        /// <returns>200 if edit success, otherwise 400.</returns>
        public async Task<HttpStatusCode> EditPost(EditPostInfoRequest postNewInfo)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(x => x.Id == postNewInfo.PostId);
            if (post is null)
                return HttpStatusCode.NotFound;
            await UpdatePost(post, postNewInfo);
            return HttpStatusCode.OK;
        }

        /// <summary>
        /// Gets full information about post.
        /// </summary>
        /// <param name="postId">Id of post.</param>
        /// <returns>PostResponse object with full info about post or null if postId is non-exsiting.</returns>
        public async Task<PostResponse?> GetPost(User userFromJwt, int postId)
        {
            var post = await _context.Posts.Include(e => e.User).Include(x => x.PostLikes).Include(x => x.PostComments).FirstOrDefaultAsync(x => x.Id == postId);
            if (post is null)
                return null;

            var responseValidator = await CheckForValidationGeProfile(userFromJwt, post.User);
            if (responseValidator is not null)
                return responseValidator;

            PostResponse postResponse = ConvertEntityObjectToPostDto(post, userFromJwt.Id);
            return postResponse;
        }

        /// <summary>
        /// Gets list of full information about all user`s posts.
        /// </summary>
        /// <param name="userFromJwt">User object got from jwt token.</param>
        /// <returns>List of all user`s posts info or null if token was invalid.</returns>
        public async Task<List<PostResponse>?> GetPosts(User userFromJwt)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userFromJwt.Id);

            if (user is null)
                return null;
            
            _context.Entry(user).Collection(x => x.Posts).Query().Include(x => x.PostLikes).Load();
            _context.Entry(user).Collection(x => x.Posts).Query().Include(x => x.PostComments).Load();
            
            List<PostResponse> resPostsList = new();
            foreach (var post in user.Posts)
            {
                var postDto = ConvertEntityObjectToPostDto(post, user.Id);
                resPostsList.Add(postDto);
            }
            resPostsList = resPostsList.OrderByDescending(x => x.CreatedAt).ToList();
            return resPostsList;
        }

        /// <summary>
        /// Gets list of images of all user`s posts.
        /// </summary>
        /// <param name="userFromJwt">User object got from jwt token.</param>
        /// <returns>List of all user`s posts images or null if token was invalid.</returns>
        public async Task<List<PostImageResponse>?> GetPostsImages(User userFromJwt)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userFromJwt.Id);
           
            if (user is null)
                return null;

            _context.Entry(user).Collection(x => x.Posts).Load();
            List<PostImageResponse> resPostsImagesList = new();
            var allPostsOrderByDateDesc = user.Posts.OrderByDescending(x => x.CreatedAt).ToList();
            foreach (var post in allPostsOrderByDateDesc)
            {
                var postImage = new PostImageResponse()
                {
                    PostId = post.Id,
                    Image = post.Image
                };

                resPostsImagesList.Add(postImage);
            }

            return resPostsImagesList;
        }

        /// <summary>
        /// Gets recommended 50 posts according to user`s follows.
        /// </summary>
        /// <param name="userFromJwt">User object got from jwt token.</param>
        /// <returns>List of 50 last recommended posts info or null if token was invalid.</returns>
        public async Task<List<PostResponse>?> GetRecommendedPosts(User userFromJwt)
        {
            var user = await _context.Users.Include(x => x.Follower).FirstOrDefaultAsync(x => x.Email == userFromJwt.Email);

            List<PostResponse> resPostsList = new();
            foreach (var followee in user.Follower)
            {
                var followeeUser = await _context.Users.Include(x => x.Posts).ThenInclude(x => x.PostLikes).Include(x => x.Posts).ThenInclude(x => x.PostComments).FirstOrDefaultAsync(x => x.Id == followee.FolloweeId);
                var followeeUserPosts = GetUserPostsDuringWeek(followeeUser!, user.Id);
                resPostsList.AddRange(followeeUserPosts);
            }

            resPostsList.OrderBy(x => x.CreatedAt).Take(50);
            return resPostsList;
        }


        /// <summary>
        /// Adds like on post from user.
        /// </summary>
        /// <param name="likeInfo">LikePostRequest object with date and id of post.</param>
        /// <param name="userFromJwt">User object info from jwt.</param>
        /// <returns>200 if liked. 400 if smth went wrong.</returns>
        public async Task<HttpStatusCode> LikePost(LikePostRequest likeInfo, User userFromJwt)
        {
            var user = await _context.Users.Include(x => x.Follower).FirstOrDefaultAsync(x => x.Email == userFromJwt.Email);
            if (user is null)
                return HttpStatusCode.BadRequest;

            var post = await _context.Posts.Include(x => x.PostLikes).FirstOrDefaultAsync(x => x.Id == likeInfo.PostId);
            var postLike = new PostLike() { CreatedAt = likeInfo.CreatedAt, PostId = post.Id, UserId = user.Id };
            await AddPostLikeToContext(postLike);
            return HttpStatusCode.OK;
        }


        /// <summary>
        /// Deletes like from post from user.
        /// </summary>
        /// <param name="likeInfo">LikePostRequest object with date and id of post.</param>
        /// <param name="userFromJwt">User object info from jwt.</param>
        /// <returns>200 if like id deleted. 400 if smth went wrong.</returns>
        public async Task<HttpStatusCode> UnlikePost(LikePostDeleteRequest likeInfo, User userFromJwt)
        {
            var user = await _context.Users.Include(x => x.Follower).FirstOrDefaultAsync(x => x.Email == userFromJwt.Email);
            if (user is null)
                return HttpStatusCode.BadRequest;

            var post = await _context.Posts.Include(x => x.PostLikes).FirstOrDefaultAsync(x => x.Id == likeInfo.PostId);
            var postLike = await _context.PostsLikes.FirstOrDefaultAsync(x => x.PostId == likeInfo.PostId && x.UserId == user.Id);

            if (postLike is null)
                return HttpStatusCode.BadRequest;

            await DeletePostLikeFromContext(postLike);
            return HttpStatusCode.OK;
        }



        /// <summary>
        /// Converts post DTO to Post entity.
        /// </summary>
        /// <param name="postInfo">Post DTO.</param>
        /// <param name="user">User that creates post.</param>
        /// <returns>Post entity.</returns>
        private Post ConvertPostDtoToPost(CreatePostRequest postInfo, User? user)
        {
            return new Post
            {
                CreatedAt = postInfo.CreatedAt,
                Description = postInfo.Description,
                Image = postInfo.Image,
                User = user,
                UserId = user.Id
            };
        }

        /// <summary>
        /// Adds post to db context.
        /// </summary>
        /// <param name="post">Post entity object to add.</param>
        private async Task AddPostToContext(Post post)
        {
            await _context.Posts.AddAsync(post);
            await _context.SaveChangesAsync();
        }


        /// <summary>
        /// Deletes post from db context.
        /// </summary>
        /// <param name="post">Post entity db object to delete.</param>
        private async Task DeletePostFromContext(Post post)
        {
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
        }


        /// <summary>
        /// Updates post description.
        /// </summary>
        /// <param name="post">Existing post entity.</param>
        /// <param name="postNew">Post DTO with new decription.</param>
        private async Task UpdatePost(Post post, EditPostInfoRequest postNew)
        {
            post.Description = postNew.Description;
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Converts post to postdto with all info about post.
        /// </summary>
        /// <param name="post">Post we want to convert.</param>
        /// <returns>Post DTO with full info.</returns>
        private PostResponse ConvertEntityObjectToPostDto(Post post, int myId)
        {
            PostResponse postResponse = new PostResponse
            {
                PostId = post.Id,
                Description = post.Description,
                Image = post.Image,
                CreatedAt = post.CreatedAt,
                Response = MyResponses.Ok
            };

            postResponse.LikesCount = post.PostLikes.Count;
            postResponse.CommentsCount = post.PostComments.Count;
            postResponse.Avatar = post.User.Avatar;
            postResponse.Username = post.User.UserName;
            postResponse.FullName = $"{post.User.FirstName} {post.User.LastName}";

            postResponse.IsLike = post.PostLikes.Any(x => x.UserId == myId);
            postResponse.IsMine = post.User.Id== myId;
            return postResponse;
        }

        /// <summary>
        /// Gets user`s followees` posts for the last 7 days.
        /// </summary>
        /// <param name="followeeUser"></param>
        /// <returns></returns>
        private List<PostResponse> GetUserPostsDuringWeek(User followeeUser, int myId)
        {
            List<PostResponse> list = new();

            var posts =  followeeUser.Posts.Where(x => (DateTime.Now - x.CreatedAt).TotalDays <= 7 && (DateTime.Now - x.CreatedAt).TotalSeconds >= 0).ToList();
            foreach (var post in posts)
            {
                list.Add(ConvertEntityObjectToPostDto(post, myId));
            }

            return list;
        }

        /// <summary>
        /// Checks for users objects and for account of requested user to be opened or requested user must be a friend of currUser.
        /// </summary>
        /// <param name="currUser">User object.</param>
        /// <param name="requestedUser">Requested user object.</param>
        /// <returns>Null if validation is ok. Otherwise empty ProfileResponse with response message.</returns>
        public async Task<PostResponse?> CheckForValidationGeProfile(User? currUser, User? requestedUser)
        {
            if (currUser is null || requestedUser is null)
                return new PostResponse() { Response = MyResponses.BadRequest };

            if (!requestedUser.IsOpenAcc)
            {
                if (!await AreFriends(currUser, requestedUser))
                {
                    return new PostResponse() { Response = MyResponses.ClosedAcc };
                }
            }

            return null;
        }

        /// <summary>
        /// Checks whether two users are friends or not.
        /// </summary>
        /// <param name="currUser">User 1 object.</param>
        /// <param name="user">User2 object.</param>
        /// <returns>True if users are friends, False if they are not friends.</returns>
        private async Task<bool> AreFriends(User currUser, User user)
        {
            var followOneToSecond = await _context.Follows.FirstOrDefaultAsync(x => x.FollowerId == currUser.Id && x.FolloweeId == user.Id);
            var followSecondToFirst = await _context.Follows.FirstOrDefaultAsync(x => x.FollowerId == user.Id && x.FolloweeId == currUser.Id);

            return followOneToSecond is not null && followSecondToFirst is not null;
        }

        /// <summary>
        /// Adds PostLike object to db context.
        /// </summary>
        /// <param name="postLike">PostLike object to add.</param>
        private async Task DeletePostLikeFromContext(PostLike postLike)
        {
            _context.PostsLikes.Remove(postLike);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Deletes PostLike object from db context.
        /// </summary>
        /// <param name="postLike">PostLike object to delete.</param>
        private async Task AddPostLikeToContext(PostLike postLike)
        {
            await _context.PostsLikes.AddAsync(postLike);
            await _context.SaveChangesAsync();
        }
    }
}
