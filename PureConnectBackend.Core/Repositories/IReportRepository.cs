using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Repositories
{
    public interface IReportRepository : IRepository<Report>
    {
        Task<ReportResponse> GetReportResponseById(int reportId);
        Task<List<ReportResponse>> GetAllReportResponses();
    }
}
