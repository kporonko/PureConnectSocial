using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Models;
using System.Security.Claims;

namespace PureConnectBackend.Controllers
{
    /// <summary>
    /// Test controller.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IConfiguration _config;
        private IUserService _userService;

        public UserController(IConfiguration config, IUserService userService)
        {
            _config = config;
            _userService = userService;
        }

        /// <summary>
        /// Gets profile info of current user.
        /// </summary>
        /// <returns>Profile info of current user.</returns>
        [HttpGet("my-profile")]
        [Authorize(Roles = "user")]
        public async Task<ActionResult<PostResponse?>> GetMyProfile()
        {
            var currUser = GetCurrentUser();
            var response = await _userService.GetProfile(currUser);
            if (response is null)
                return NotFound();
            
            return Ok(response);
        }

        /// <summary>
        /// Gets profile avatar of current user.
        /// </summary>
        /// <returns>Avatar of current user.</returns>
        [HttpGet("my-avatar")]
        [Authorize]
        public async Task<ActionResult<GetAvatarResponse?>> GetMyAvatar()
        {
            var currUser = GetCurrentUser();
            var response = await _userService.GetProfileAvatar(currUser);
            if (response is null)
                return NotFound();

            return Ok(response);
        }


        /// <summary>
        /// Gets 0-10 recommended users for current user.
        /// </summary>
        /// <returns>List of max 10 recommended users to current user.</returns>
        [HttpGet("recommended-users")]
        [Authorize]
        public async Task<ActionResult<List<RecommendedUserResponse>?>> GetRecommendedUsers()
        {
            var currUser = GetCurrentUser();
            var response = await _userService.GetRecommendedUsers(currUser);
            if (response is null)
                return NotFound();

            return Ok(response.Take(10));
        }

        private User GetCurrentUser()
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
