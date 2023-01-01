using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Requests;
using System.Net;

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
            var res = await _followService.AddFollow(followRequest);
            if ((int)res == 201)
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
            var res = await _followService.RemoveFollow(followRequest);
            if ((int)res == 201)
                return Ok(_stringLocalizer.GetString("FollowDeleted"));

            return BadRequest(_stringLocalizer.GetString("DeleteFail"));
        }
    }
}
