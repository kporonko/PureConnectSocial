using PureConnectBackend.Core.Models.Models;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Repositories
{
    public interface IFollowRepository : IRepository<Follow>
    {
        Task<Follow> GetFollowAsync(int followerId, int followeeId);
    }
}