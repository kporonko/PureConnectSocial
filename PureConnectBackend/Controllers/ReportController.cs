using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Requests;
using System.Net;

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
        public async Task<ActionResult<HttpStatusCode>> AddReport(AddReportRequest report)
        {
            var response = await _reportService.AddReport(report);
            if (response == HttpStatusCode.OK)
                return Ok();
            else
                return BadRequest();
        }

        [HttpPost("post-report")]
        public async Task<ActionResult<HttpStatusCode>> AddPostReport(AddPostReportRequest postReport)
        {
            var response = await _reportService.AddPostReport(postReport);
            if (response == HttpStatusCode.OK)
                return Ok();
            else
                return BadRequest();
        }
    }
}
