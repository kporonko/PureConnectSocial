using PureConnectBackend.Core.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Interfaces
{
    public interface IAdminService
    {
        Task<List<ReportResponse>> GetReports();
        Task<List<ReportPostResponse>> GetPostReports();
        Task<ReportResponse> GetReport(int reportId);
        Task<ReportPostResponse> GetPostReport(int postReportId);

        Task<HttpStatusCode> DeleteReport(int reportId);
        Task<HttpStatusCode> DeletePostReport(int postReportId);
    }
}
