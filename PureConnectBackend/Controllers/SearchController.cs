using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Localization;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Models;
using System.Collections;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PureConnectBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISearchService _searchService;
        private readonly IStringLocalizer<SearchController> _stringLocalizer;

        public SearchController(IConfiguration config, ISearchService searchService, IStringLocalizer<SearchController> stringLocalizer)
        {
            _config = config;
            _searchService = searchService;
            _stringLocalizer = stringLocalizer;
        }

        /// <summary>
        /// Gets recommended posts for the feed
        /// </summary>
        /// <param name="feedType">Type of recommended posts (popular, trending, fromPopularUsers)</param>
        /// <param name="timeFrame">For trending posts, time frame in hours (default: 24)</param>
        /// <param name="count">Number of posts to return (default: 20)</param>
        /// <returns>List of post images for the feed</returns>
        [HttpGet("recommended")]
        public async Task<ActionResult<List<PostImageResponse>>> GetRecommendedPosts(int timeFrame = 24, int count = 20)
        {
            try
            {
                var currUser = GetCurrentUser();
                if (currUser == null)
                    return NotFound();

                // exclude my posts from list
                // exclude liked posts by me

                List<PostImageResponse> posts = new List<PostImageResponse>();

                var trends = await _searchService.GetTrendingPosts(timeFrame, count);
                var popularUsersPosts = await _searchService.GetPostsFromPopularUsers(count);
                var popular = await _searchService.GetMostPopularPosts(count);

                posts.AddRange(trends.Concat(popularUsersPosts.Concat(popular)));
                posts.Sort((a, b) => new Random().Next(-1, 2));
                posts = posts.Distinct().ToList();

                return Ok(posts);
            }
            catch (Exception ex)
            {
                return BadRequest(_stringLocalizer.GetString("RetrievalFailed") + ": " + ex.Message);
            }
        } 

        /// <summary>
        /// Gets current user by authorizing jwt token
        /// </summary>
        /// <returns>Current user or null</returns>
        private User? GetCurrentUser()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity is not null)
            {
                var userClaims = identity.Claims;

                return new User
                {
                    UserName = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)?.Value,
                    Email = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Email)?.Value,
                    FirstName = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.GivenName)?.Value,
                    LastName = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Surname)?.Value,
                    Role = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Role)?.Value,
                    Id = Convert.ToInt32(userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Sid)?.Value)
                };
            }
            return null;
        }
    }
}