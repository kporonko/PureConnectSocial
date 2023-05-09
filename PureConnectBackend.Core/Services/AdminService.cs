using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Data;
using PureConnectBackend.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Services
{
    public class AdminService : IAdminService
    {
        private ApplicationContext _context;

        public AdminService(ApplicationContext context)
        {
            _context = context;
        }

        public async Task<HttpStatusCode> DeletePostReport(int postReportId)
        {
            var postReport = await _context.PostsReports.FirstOrDefaultAsync(x => x.Id == postReportId);
            if (postReport is null)
                return HttpStatusCode.NotFound;

            _context.PostsReports.Remove(postReport);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
            
        }

        public async Task<HttpStatusCode> DeleteReport(int reportId)
        {
            var postReport = await _context.Reports.FirstOrDefaultAsync(x => x.Id == reportId);
            if (postReport is null)
                return HttpStatusCode.NotFound;

            _context.Reports.Remove(postReport);
            await _context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }

        public async Task<ReportPostResponse> GetPostReport(int postReportId)
        {
            var postReport = await _context.PostsReports.FirstOrDefaultAsync(x => x.Id == postReportId);
            if (postReport is null)
                return null;

            return new ReportPostResponse
            {
                Id = postReport.Id,
                PostId = postReport.PostId,
                Text = postReport.Text,
                CreatedAt = postReport.CreatedAt
            };
        }

        public async Task<List<ReportPostResponse>> GetPostReports()
        {
            var postReports = await _context.PostsReports.Select(x => new ReportPostResponse
            {
                Id = x.Id,
                PostId = x.PostId,
                Text = x.Text,
                CreatedAt = x.CreatedAt
            }).ToListAsync();

            return postReports;
        }

        public async Task<ReportResponse> GetReport(int reportId)
        {
            var report = await _context.Reports.FirstOrDefaultAsync(x => x.Id == reportId);

            if (report is null)
                return null;

            return new ReportResponse
            {
                Id = report.Id,
                Text = report.Text,
                CreatedAt = report.CreatedAt
            };
        }

        public async Task<List<ReportResponse>> GetReports()
        {
            var reports = await _context.Reports.Select(x => new ReportResponse
            {
                Id = x.Id,
                Text = x.Text,
                CreatedAt = x.CreatedAt
            }).ToListAsync();

            return reports;
        }
    }
}
