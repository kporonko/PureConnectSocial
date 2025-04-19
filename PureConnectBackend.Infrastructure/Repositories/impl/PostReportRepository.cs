using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Core.Repositories;
using PureConnectBackend.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PureConnectBackend.Infrastructure.Repositories.impl
{
    public class PostReportRepository : Repository<PostReport>, IPostReportRepository
    {
        public PostReportRepository(ApplicationContext context) : base(context)
        {
        }

        public async Task<ReportPostResponse> GetPostReportResponseById(int postReportId)
        {
            var postReport = await _dbSet.FirstOrDefaultAsync(x => x.Id == postReportId);
            if (postReport == null)
                return null;

            return new ReportPostResponse
            {
                Id = postReport.Id,
                PostId = postReport.PostId,
                Text = postReport.Text,
                CreatedAt = postReport.CreatedAt
            };
        }

        public async Task<List<ReportPostResponse>> GetAllPostReportResponses()
        {
            return await _dbSet.Select(x => new ReportPostResponse
            {
                Id = x.Id,
                PostId = x.PostId,
                Text = x.Text,
                CreatedAt = x.CreatedAt
            }).ToListAsync();
        }
    }
}