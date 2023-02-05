using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Infrastructure.Models;

namespace PureConnectBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private IAdminService _adminService;
        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("reports")]
        public IActionResult GetReports()
        {
            var reports = _adminService.GetReports();
            if (reports is null)
                return NotFound();
            
            return Ok(reports);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("post-reports")]
        public IActionResult GetPostReports()
        {
            var postReports = _adminService.GetPostReports();
            if (postReports is null)
                return NotFound();

            return Ok(postReports);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("report/{reportId}")]
        public IActionResult GetReport([FromRoute]int reportId)
        {
            var report = _adminService.GetReport(reportId);
            if (report is null)
                return NotFound();

            return Ok(report);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("post-report/{postReportId}")]
        public IActionResult GetPostReport([FromRoute] int postReportId)
        {
            var postReport = _adminService.GetPostReport(postReportId);
            if (postReport is null)
                return NotFound();

            return Ok(postReport);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("report")]
        public IActionResult DeleteReport([FromRoute] int reportId)
        {
            var result = _adminService.DeleteReport(reportId);
            if (result is null)
                return NotFound();

            return Ok(result);
        }
    }
}
