﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PureConnectBackend.Core.Extentions;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using System.Net;
using System.Security.Claims;

namespace PureConnectBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private IConfiguration _config;
        private IPostService _postService;
        public PostController(IConfiguration config, IPostService postService)
        {
            _config = config;
            _postService = postService;
        }

        /// <summary>
        /// Creates a new post.
        /// </summary>
        /// <param name="postRequest">CreatePostRequest dto object with post info.</param>
        /// <returns>Ok(200) if post was created, otherwise BadRequest(400).</returns>
        [Authorize(Roles = "user")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreatePostRequest postRequest)
        {
            var user = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
            var response = await _postService.CreatePost(postRequest, user);
            if (response == HttpStatusCode.Created)
                return Ok();

            return BadRequest();
        }

        /// <summary>
        /// Deletes post from db.
        /// </summary>
        /// <param name="postRequest">DeletePostRequest object with id of post to delete.</param>
        /// <returns>Ok(200) if post was deleted, otherwise NotFound(404).</returns>
        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> Post([FromBody] DeletePostRequest postRequest)
        {
            var response = await _postService.DeletePost(postRequest);
            if (response == HttpStatusCode.OK)
                return Ok();
            
            return NotFound();
        }

        /// <summary>
        /// Edits post in db.
        /// </summary>
        /// <param name="postRequest">EditPostInfoRequest object with post id and it`s new information.</param>
        /// <returns>Ok(200) if post was updated, otherwise NotFound(404).</returns>
        [Authorize(Roles = "user")]
        [HttpPut]
        public async Task<IActionResult> Post([FromBody] EditPostInfoRequest postRequest)
        {
            var response = await _postService.EditPost(postRequest);

            if (response == HttpStatusCode.OK)
                return Ok();

            return NotFound();
        }

        /// <summary>
        /// Gets post from db.
        /// </summary>
        /// <param name="postId">Id of post.</param>
        /// <returns>PostResponse object with 200 code if post was found, otherwise NotFound(404).</returns>
        [Authorize]
        [HttpGet("post/{postId}")]
        public async Task<ActionResult<PostResponse>> Post([FromRoute]int postId)
        {
            var user = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
            var post = await _postService.GetPost(user, postId);

            if (post is null)
                return NotFound();

            if (post.Response == Core.Models.MyResponses.BadRequest)
                return BadRequest();
            
            if (post.Response == Core.Models.MyResponses.ClosedAcc)
                return Forbid();
           
            return Ok(post);
        }

        /// <summary>
        /// Gets all user`s posts images from db.
        /// </summary>
        /// <returns>List of PostImageResponse object with 200 code if user was found, otherwise NotFound(404).</returns>
        [Authorize]
        [HttpGet("images/{userId?}")]
        public async Task<ActionResult<List<PostImageResponse>>> PostsImages([FromRoute] int? userId)
        {
            User user;
            if (userId.HasValue && userId != null)
                user = new User { Id = userId.Value };
            else
                user = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);

            var postsImages = await _postService.GetPostsImages(user);
            if (postsImages is null)
                return NotFound();
            
            return Ok(postsImages);
        }

        /// <summary>
        /// Gets all user`s posts from db.
        /// </summary>
        /// <returns>List of PostResponse objects with 200 code if user was found, otherwise NotFound(404).</returns>
        [Authorize]
        [HttpGet("posts/{userId?}")]
        public async Task<ActionResult<List<PostResponse>>> Posts([FromRoute] int? userId)
        {
            User user;
            if (userId.HasValue && userId != null)
                user = new User { Id = userId.Value };
            else
                user = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);

            var posts = await _postService.GetPosts(user!);
            if (posts is null)
                return NotFound();

            return Ok(posts);
        }

        /// <summary>
        /// Gets the list of 50 user`s followees` posts during last week.
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet("recommended-posts")]
        public async Task<ActionResult<List<PostResponse>>> RecommendedPosts()
        {
            var user = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
            var posts = await _postService.GetRecommendedPosts(user!);
            if (posts is null)
                return NotFound();

            return Ok(posts);
        }


        /// <summary>
        /// Adds like on post.
        /// </summary>
        /// <param name="postInfo">LikePostRequest object.</param>
        /// <returns>Ok if like was put. 404 if smth went wrong.</returns>
        [Authorize]
        [HttpPost("like")]
        public async Task<IActionResult> LikePost([FromBody] LikePostRequest postInfo)
        {
            var user = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
            var response = await _postService.LikePost(postInfo, user);
            if (response == HttpStatusCode.OK)
                return Ok();

            return NotFound();
        }

        /// <summary>
        /// Deletes like from post.
        /// </summary>
        /// <param name="postInfo">LikePostDeleteRequest object.</param>
        /// <returns>Ok if like was put. 404 if smth went wrong.</returns>
        [Authorize]
        [HttpDelete("like")]
        public async Task<IActionResult> UnLikePost([FromBody] LikePostDeleteRequest postInfo)
        {
            var user = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
            var response = await _postService.UnlikePost(postInfo, user);
            if (response == HttpStatusCode.OK)
                return Ok();

            return NotFound();
        }

        [Authorize]
        [HttpGet("users-liked-post/{postId}")]
        public async Task<ActionResult<List<UserLikedPost>>> UsersLikedPost([FromRoute] int postId)
        {
            var user = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
            var users = await _postService.GetUsersLikedPost(user, postId);
            if (users is null)
                return NotFound();

            return Ok(users);
        }
    }
}
