using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Models;
using System.Net;

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
        public async Task<IActionResult> CreatePost([FromBody] CreatePostRequest postRequest)
        {
            var response = await _postService.CreatePost(postRequest);
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
        public async Task<IActionResult> DeletePost([FromBody] DeletePostRequest postRequest)
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
        public async Task<IActionResult> EditPost([FromBody] EditPostInfoRequest postRequest)
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
        [HttpGet]
        public async Task<ActionResult<PostResponse>> GetPost(int postId)
        {
            var post = await _postService.GetPost(postId);
            if(post is null)
                return NotFound();
            
            return Ok(post);
        }

        /// <summary>
        /// Gets all user`s posts images from db.
        /// </summary>
        /// <param name="token">JWT user`s token whose posts are being gotten.</param>
        /// <returns>List of PostImageResponse object with 200 code if user was found, otherwise NotFound(404).</returns>
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<PostImageResponse>>> GetPostsImages(string token)
        {
            var postsImages = await _postService.GetPostsImages(token);
            if (postsImages is null)
                return NotFound();
            
            return Ok(postsImages);
        }

        /// <summary>
        /// Gets all user`s posts from db.
        /// </summary>
        /// <param name="token">JWT user`s token whose posts are being gotten.</param>
        /// <returns>List of PostResponse objects with 200 code if user was found, otherwise NotFound(404).</returns>
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<PostResponse>>> GetPosts(string token)
        {
            var posts = await _postService.GetPosts(token);
            if (posts is null)
                return NotFound();
            
            return Ok(posts);
        }
    }
}
