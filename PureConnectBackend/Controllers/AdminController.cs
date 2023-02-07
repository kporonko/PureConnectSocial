using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Requests;
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

        [Authorize(Roles = "admin")]
        [HttpGet("reports")]
        public async Task<IActionResult> GetReports()
        {
            var reports = await _adminService.GetReports();
            if (reports is null)
                return NotFound();
            
            return Ok(reports);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("post-reports")]
        public async Task<IActionResult> GetPostReports()
        {
            var postReports = await _adminService.GetPostReports();
            if (postReports is null)
                return NotFound();

            return Ok(postReports);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("report/{reportId}")]
        public async Task<IActionResult> GetReport([FromRoute]int reportId)
        {
            var report = await _adminService.GetReport(reportId);
            if (report is null)
                return NotFound();

            return Ok(report);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("post-report/{postReportId}")]
        public async Task<IActionResult> GetPostReport([FromRoute] int postReportId)
        {
            var postReport = await  _adminService.GetPostReport(postReportId);
            if (postReport is null)
                return NotFound();

            return Ok(postReport);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("report")]
        public async Task<IActionResult> DeleteReport(DeleteReportRequest deleteReport)
        {
            var result = await _adminService.DeleteReport(deleteReport.ReportId);
            if (result is System.Net.HttpStatusCode.NotFound)
                return NotFound();

            return Ok(result);
        }
    }
}
