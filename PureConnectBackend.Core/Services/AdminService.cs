using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Core.Repositories;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Services
{
    public class AdminService : IAdminService
    {
        private readonly IReportRepository _reportRepository;
        private readonly IPostReportRepository _postReportRepository;

        public AdminService(IReportRepository reportRepository, IPostReportRepository postReportRepository)
        {
            _reportRepository = reportRepository;
            _postReportRepository = postReportRepository;
        }

        public async Task<HttpStatusCode> DeletePostReport(int postReportId)
        {
            var postReport = await _postReportRepository.GetByIdAsync(postReportId);
            if (postReport == null)
                return HttpStatusCode.NotFound;

            await _postReportRepository.DeleteAsync(postReport);
            await _postReportRepository.SaveChangesAsync();
            return HttpStatusCode.OK;
        }

        public async Task<HttpStatusCode> DeleteReport(int reportId)
        {
            var report = await _reportRepository.GetByIdAsync(reportId);
            if (report == null)
                return HttpStatusCode.NotFound;

            await _reportRepository.DeleteAsync(report);
            await _reportRepository.SaveChangesAsync();
            return HttpStatusCode.OK;
        }

        public async Task<ReportPostResponse> GetPostReport(int postReportId)
        {
            return await _postReportRepository.GetPostReportResponseById(postReportId);
        }

        public async Task<List<ReportPostResponse>> GetPostReports()
        {
            return await _postReportRepository.GetAllPostReportResponses();
        }

        public async Task<ReportResponse> GetReport(int reportId)
        {
            return await _reportRepository.GetReportResponseById(reportId);
        }

        public async Task<List<ReportResponse>> GetReports()
        {
            return await _reportRepository.GetAllReportResponses();
        }
    }
}