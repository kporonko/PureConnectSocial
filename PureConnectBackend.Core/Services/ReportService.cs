using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Repositories;
using System;
using System.Net;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Services
{
    public class ReportService : IReportService
    {
        private readonly IUserRepository _userRepository;
        private readonly IReportRepository _reportRepository;
        private readonly IPostReportRepository _postReportRepository;

        public ReportService(
            IUserRepository userRepository,
            IReportRepository reportRepository,
            IPostReportRepository postReportRepository)
        {
            _userRepository = userRepository;
            _reportRepository = reportRepository;
            _postReportRepository = postReportRepository;
        }

        public async Task<HttpStatusCode> AddPostReport(User userJwt, AddPostReportRequest postReport)
        {
            var user = await _userRepository.GetByIdAsync(userJwt.Id);
            if (user == null)
                return HttpStatusCode.BadRequest;

            var postReportEntity = new PostReport
            {
                CreatedAt = postReport.CreatedAt,
                PostId = postReport.PostId,
                Text = postReport.Text,
                UserId = user.Id
            };

            try
            {
                await _postReportRepository.AddAsync(postReportEntity);
                await _postReportRepository.SaveChangesAsync();
                return HttpStatusCode.OK;
            }
            catch (Exception)
            {
                return HttpStatusCode.BadRequest;
            }
        }

        public async Task<HttpStatusCode> AddReport(User userJwt, AddReportRequest report)
        {
            var user = await _userRepository.GetByIdAsync(userJwt.Id);
            if (user == null)
                return HttpStatusCode.BadRequest;

            var reportEntity = new Report
            {
                CreatedAt = report.CreatedAt,
                Text = report.Text,
                UserId = user.Id
            };

            try
            {
                await _reportRepository.AddAsync(reportEntity);
                await _reportRepository.SaveChangesAsync();
                return HttpStatusCode.OK;
            }
            catch (Exception)
            {
                return HttpStatusCode.BadRequest;
            }
        }
    }
}