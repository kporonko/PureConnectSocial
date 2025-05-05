using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Core.Repositories;
using PureConnectBackend.Infrastructure.Data;

namespace PureConnectBackend.Infrastructure.Repositories.impl
{
    public class ReportRepository : Repository<Report>, IReportRepository
    {
        public ReportRepository(ApplicationContext context) : base(context)
        {
        }

        public async Task<ReportResponse> GetReportResponseById(int reportId)
        {
            var report = await _dbSet.FirstOrDefaultAsync(x => x.Id == reportId);
            if (report == null)
                return null;

            return new ReportResponse
            {
                Id = report.Id,
                Text = report.Text,
                CreatedAt = report.CreatedAt
            };
        }

        public async Task<List<ReportResponse>> GetAllReportResponses()
        {
            return await _dbSet.Select(x => new ReportResponse
            {
                Id = x.Id,
                Text = x.Text,
                CreatedAt = x.CreatedAt
            }).ToListAsync();
        }
    }
}