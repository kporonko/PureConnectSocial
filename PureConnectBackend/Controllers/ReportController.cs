using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Requests;
using System.Net;
using System.Security.Claims;

namespace PureConnectBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private IConfiguration _config;
        private IReportService _reportService;

        public ReportController(IConfiguration config, IReportService reportService)
        {
            _config = config;
            _reportService = reportService;
        }

        [HttpPost("report")]
        [Authorize]
        public async Task<ActionResult<HttpStatusCode>> AddReport(AddReportRequest report)
        {
            var user = GetCurrentUser();
            var response = await _reportService.AddReport(user, report);
            if (response == HttpStatusCode.OK)
                return Ok();
            else
                return BadRequest();
        }

        [HttpPost("post-report")]
        [Authorize]
        public async Task<ActionResult<HttpStatusCode>> AddPostReport(AddPostReportRequest postReport)
        {
            var user = GetCurrentUser();
            var response = await _reportService.AddPostReport(user, postReport);
            if (response == HttpStatusCode.OK)
                return Ok();
            else
                return BadRequest();
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
