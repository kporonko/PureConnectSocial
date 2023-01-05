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

        [Authorize(Roles = "user")]
        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostRequest postRequest)
        {
            var response = await _postService.CreatePost(postRequest);
            if (response == HttpStatusCode.Created)
                return Ok();

            return BadRequest();
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeletePost([FromBody] DeletePostRequest postRequest)
        {
            var response = await _postService.DeletePost(postRequest);
            if (response == HttpStatusCode.OK)
                return Ok();
            
            return NotFound();
        }
        [Authorize(Roles = "user")]
        [HttpPut]
        public async Task<IActionResult> EditPost([FromBody] EditPostInfoRequest postRequest)
        {
            var response = await _postService.EditPost(postRequest);

            if (response == HttpStatusCode.OK)
                return Ok();

            return BadRequest();
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<PostResponse>> GetPost(int postId)
        {
            var post = await _postService.GetPost(postId);
            if(post is null)
                return NotFound();
            
            return Ok(post);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<PostImageResponse>>> GetPostsImages(string token)
        {
            var postsImages = await _postService.GetPostsImages(token);
            if (postsImages is null)
                return NotFound();
            
            return Ok(postsImages);
        }

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
