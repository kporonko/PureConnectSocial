using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PureConnectBackend.Core.Extentions;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
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
            var currUser = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
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
            var currUser = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
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
            var currUser = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
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
        public async Task<ActionResult<MyFollowersFriendsListResponse?>> GetMyFriends()
        {
            var currUser = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
            var response = await _userService.GetUserFriendsByUser(currUser);
            if (response is null)
                return BadRequest();

            return Ok(response);
        }

        /// <summary>
        /// Gets a list of current user`s friends.
        /// </summary>
        /// <returns>MyFollowersFriendsListResponse object with data about friends.</returns>
        [HttpGet("{profileId}/friends")]
        [Authorize]
        public async Task<ActionResult<MyFollowersFriendsListResponse?>> GetUserFriends([FromRoute] int profileId)
        {
            var response = await _userService.GetUserFriendsByUser(new User { Id = profileId });
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
        public async Task<ActionResult<MyFollowersFriendsListResponse?>> GetMyFollowers()
        {
            var currUser = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
            var response = await _userService.GetFollowersByUser(currUser);
            if (response is null)
                return BadRequest();

            return Ok(response);
        }

        /// <summary>
        /// Gets a list of current user`s followers.
        /// </summary>
        /// <returns>MyFollowersFriendsListResponse object with data about followers.</returns>
        [HttpGet("{profileId}/followers")]
        [Authorize]
        public async Task<ActionResult<MyFollowersFriendsListResponse?>> GetUserFollowers([FromRoute] int profileId)
        {
            var response = await _userService.GetFollowersByUser(new User { Id = profileId});
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
            var currUser = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
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
            var currUser = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
            var response = await _userService.EditProfile(currUser, request);
            if (response == System.Net.HttpStatusCode.BadRequest)
                return BadRequest();

            return Ok(response);
        }

        [HttpGet("common-friends/{profileId}")]
        [Authorize]
        public async Task<ActionResult<List<RecommendedUserResponse>?>> GetCommonFriends([FromRoute] int profileId)
        {
            var currUser = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
            var response = await _userService.GetCommonFriends(currUser, profileId);
            if (response is null)
                return BadRequest();

            return Ok(response);
        }
    }
}
