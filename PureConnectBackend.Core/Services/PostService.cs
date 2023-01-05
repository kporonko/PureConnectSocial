using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Extentions;
using PureConnectBackend.Core.Interfaces;
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
        public async Task<PostResponse?> GetPost(int postId)
        {
            var post = await _context.Posts.Include(e => e.User).Include(x => x.PostLikes).Include(x => x.PostComments).FirstOrDefaultAsync(x => x.Id == postId);
            if (post is null)
                return null;

            PostResponse postResponse = ConvertEntityObjectToPostDto(post);
            return postResponse;
        }

        /// <summary>
        /// Gets list of full information about all user`s posts.
        /// </summary>
        /// <param name="userFromJwt">User object got from jwt token.</param>
        /// <returns>List of all user`s posts info or null if token was invalid.</returns>
        public async Task<List<PostResponse>?> GetPosts(User userFromJwt)
        {
            var user = await _context.Users.Include(x => x.Posts).ThenInclude(x => x.PostLikes).Include(x => x.PostsComments).FirstOrDefaultAsync(x => x.Email == userFromJwt.Email);
            if (user is null)
                return null;

            List<PostResponse> resPostsList = new();
            foreach (var post in user.Posts)
            {
                var postDto = ConvertEntityObjectToPostDto(post);
                resPostsList.Add(postDto);
            }

            return resPostsList;
        }

        /// <summary>
        /// Gets list of images of all user`s posts.
        /// </summary>
        /// <param name="userFromJwt">User object got from jwt token.</param>
        /// <returns>List of all user`s posts images or null if token was invalid.</returns>
        public async Task<List<PostImageResponse>?> GetPostsImages(User userFromJwt)
        {
            var user = await _context.Users.Include(x => x.Posts).FirstOrDefaultAsync(x => x.Email == userFromJwt.Email);
            if (user is null)
                return null;

            List<PostImageResponse> resPostsImagesList = new();
            foreach (var post in user.Posts)
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
                var followeeUserPosts = GetUserPostsDuringWeek(followeeUser!);
                resPostsList.AddRange(followeeUserPosts);
            }

            resPostsList.OrderBy(x => x.CreatedAt);
            return resPostsList;
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
        private PostResponse ConvertEntityObjectToPostDto(Post post)
        {
            PostResponse postResponse = new PostResponse
            {
                PostId = post.Id,
                Description = post.Description,
                Image = post.Image,
                CreatedAt = post.CreatedAt
            };

            postResponse.LikesCount = post.PostLikes.Count;
            postResponse.CommentsCount = post.PostComments.Count;
            postResponse.Avatar = post.User.Avatar;
            postResponse.Username = post.User.UserName;
            postResponse.FullName = $"{post.User.FirstName} {post.User.LastName}";

            return postResponse;
        }

        /// <summary>
        /// Gets user`s followees` posts for the last 7 days.
        /// </summary>
        /// <param name="followeeUser"></param>
        /// <returns></returns>
        private List<PostResponse> GetUserPostsDuringWeek(User followeeUser)
        {
            List<PostResponse> list = new();

            var posts =  followeeUser.Posts.Where(x => (DateTime.Now - x.CreatedAt).TotalDays <= 7(DateTime.Now - x.CreatedAt).TotalSeconds >= 0).ToList();
            foreach (var post in posts)
            {
                list.Add(ConvertEntityObjectToPostDto(post));
            }

            return list;
        }
    }
}
