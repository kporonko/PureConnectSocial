using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Requests;
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

            return Ok(response.Take(5));
        }

        /// <summary>
        /// Gets a list of current user`s friends.
        /// </summary>
        /// <returns>MyFollowersFriendsListResponse object with data about friends.</returns>
        [HttpGet("friends")]
        [Authorize]
        public async Task<ActionResult<MyFollowersFriendsListResponse?>> GetFriends()
        {
            var currUser = GetCurrentUser();
            var response = await _userService.GetMyFriends(currUser);
            if (response is null)
                return BadRequest();

            return Ok(response);
        }

        /// <summary>
        /// Gets a list of current user`s followers.
        /// </summary>
        /// <returns>MyFollowersFriendsListResponse object with data about followers.</returns>
        [HttpGet("followers")]
        [Authorize]
        public async Task<ActionResult<MyFollowersFriendsListResponse?>> GetFollowers()
        {
            var currUser = GetCurrentUser();
            var response = await _userService.GetMyFollowers(currUser);
            if (response is null)
                return BadRequest();

            return Ok(response);
        }

        /// <summary>
        /// Gets profile info of requested user.
        /// </summary>
        /// <param name="profileId">Id of requested user.</param>
        /// <returns>Response model with Ok(200) status. Forbidden(403) if acc is closed and user is not a friend of requested user. Bad Request(404) if culdnt find a user.</returns>
        [HttpGet("profile/{profileId}")]
        [Authorize]
        public async Task<ActionResult<ProfilePageResponse>> GetProfileById([FromRoute] int profileId)
        {
            var currUser = GetCurrentUser();
            var response = await _userService.GetProfileById(currUser, profileId);
            
            if (response.Response == Core.Models.MyResponses.ClosedAcc)
                return Forbid();
            else if (response.Response == Core.Models.MyResponses.BadRequest)
                return BadRequest();

            return Ok(response);
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<ActionResult<ProfileResponse>> UpdateProfile([FromBody] ProfileEditRequest request)
        {
            var currUser = GetCurrentUser();
            var response = await _userService.EditProfile(currUser, request);
            if (response == System.Net.HttpStatusCode.BadRequest)
                return BadRequest();

            return Ok(response);
        }

        [HttpGet("common-friends/{profileId}")]
        [Authorize]
        public async Task<ActionResult<List<RecommendedUserResponse>?>> GetCommonFriends([FromRoute] int profileId)
        {
            var currUser = GetCurrentUser();
            var response = await _userService.GetCommonFriends(currUser, profileId);
            if (response is null)
                return BadRequest();

            return Ok(response);
        }

        /// <summary>
        /// Gets current user by authorizing jwt token.
        /// </summary>
        /// <returns></returns>
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
