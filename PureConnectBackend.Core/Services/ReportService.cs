using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Requests;
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
    public class ReportService : IReportService
    {
        /// <summary>
        /// Entity Framework DbContext.
        /// </summary>
        private readonly ApplicationContext _context;

        public ReportService(ApplicationContext context)
        {
            _context = context;
        }

        public async Task<HttpStatusCode> AddPostReport(AddPostReportRequest postReport)
        {
            PostReport postReportResult = new PostReport
            {
                CreatedAt = postReport.CreatedAt,
                PostId = postReport.PostId,
                Text = postReport.Text,
                UserId = postReport.UserId
            };

            var response = await AddPostReportObjectToDb(postReportResult);
            return response;
        }


        public async Task<HttpStatusCode> AddReport(AddReportRequest report)
        {
            Report reportResult = new Report
            {
                CreatedAt = report.CreatedAt,
                Text = report.Text,
                UserId = report.UserId
            };

            var response = await AddReportObjectToDb(reportResult);
            return response;
        }


        private async Task<HttpStatusCode> AddPostReportObjectToDb(PostReport postReportResult)
        {
            try
            {
                await _context.PostsReports.AddAsync(postReportResult);
                await _context.SaveChangesAsync();
                return HttpStatusCode.OK;
            }
            catch (Exception)
            {
                return HttpStatusCode.BadRequest;
            }

        }

        private async Task<HttpStatusCode> AddReportObjectToDb(Report reportResult)
        {
            try
            {
                await _context.Reports.AddAsync(reportResult);
                await _context.SaveChangesAsync();
                return HttpStatusCode.OK;
            }
            catch (Exception)
            {
                return HttpStatusCode.BadRequest;
            }
        }
    }
}
