using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Repositories;
using PureConnectBackend.Infrastructure.Data;
using System.Threading.Tasks;

namespace PureConnectBackend.Infrastructure.Repositories.impl
{
    public class FollowRepository : Repository<Follow>, IFollowRepository
    {
        public FollowRepository(ApplicationContext context) : base(context)
        {
        }

        public async Task<Follow> GetFollowAsync(int followerId, int followeeId)
        {
            return await _dbSet.FirstOrDefaultAsync(x =>
                x.FollowerId == followerId &&
                x.FolloweeId == followeeId);
        }
    }
}