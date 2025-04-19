using PureConnectBackend.Core.Models.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Repositories
{
    public interface IPostLikeRepository : IRepository<PostLike>
    {
        Task<PostLike> GetPostLikeAsync(int postId, int userId);
        Task<List<PostLike>> GetPostLikesAsync(int postId);
    }
}