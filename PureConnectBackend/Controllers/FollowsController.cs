using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Requests;
using System.Net;
using System.Security.Claims;

namespace PureConnectBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FollowsController : ControllerBase
    {
        private IConfiguration _config;
        private IFollowService _followService;
        private readonly IStringLocalizer<FollowsController> _stringLocalizer;
        public FollowsController(IConfiguration config, IFollowService followService, IStringLocalizer<FollowsController> stringLocalizer)
        {
            _config = config;
            _followService = followService;
            _stringLocalizer = stringLocalizer;
        }

        /// <summary>
        /// Adds new follow to db.
        /// </summary>
        /// <param name="followRequest">Follow info: ids of follower and followee and date.</param>
        /// <returns>Status code of operation with localized text.</returns>
        [HttpPost("follow")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> AddFollow(FollowAddRequest followRequest)
        {
            var user = GetCurrentUser();
            var res = await _followService.AddFollow(followRequest, user);
            if (res == HttpStatusCode.Created)
                return Ok(_stringLocalizer.GetString("FollowAdd"));
            
            return BadRequest(_stringLocalizer.GetString("AddFail"));
        }

        /// <summary>
        /// Deletes follow from db.
        /// </summary>
        /// <param name="followRequest">Follow info: ids of follower and followee.</param>
        /// <returns>Status code of operation with localized text.</returns>
        [HttpDelete("follow")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> DeleteFollow(FollowDeleteRequest followRequest)
        {
            var user = GetCurrentUser();
            var res = await _followService.RemoveFollow(followRequest, user);
            if (res == HttpStatusCode.Created)
                return Ok(_stringLocalizer.GetString("FollowDeleted"));

            return BadRequest(_stringLocalizer.GetString("DeleteFail"));
        }

        /// <summary>
        /// Deletes follow from db.
        /// </summary>
        /// <param name="followRequest">Follow info: ids of follower and followee.</param>
        /// <returns>Status code of operation with localized text.</returns>
        [HttpDelete("follow-by-post")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> DeleteFollowByPostId(DeletePostRequest followRequest)
        {
            var user = GetCurrentUser();
            var res = await _followService.RemoveFollowByPostId(followRequest, user);
            if (res == HttpStatusCode.Created)
                return Ok(_stringLocalizer.GetString("FollowDeleted"));

            return BadRequest(_stringLocalizer.GetString("DeleteFail"));
        }
        
        /// <summary>
        /// Gets current user by authorizing jwt token.
        /// </summary>
        /// <returns></returns>
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
