using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PureConnectBackend.Core.Extentions;
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
            var user = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
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
            var user = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
            var response = await _reportService.AddPostReport(user, postReport);
            if (response == HttpStatusCode.OK)
                return Ok();
            else
                return BadRequest();
        }
    }
}
