using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Repositories;
using PureConnectBackend.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PureConnectBackend.Infrastructure.Repositories.impl
{
    public class PostLikeRepository : Repository<PostLike>, IPostLikeRepository
    {
        public PostLikeRepository(ApplicationContext context) : base(context)
        {
        }

        public async Task<PostLike> GetPostLikeAsync(int postId, int userId)
        {
            return await _dbSet
                .FirstOrDefaultAsync(pl => pl.PostId == postId && pl.UserId == userId);
        }

        public async Task<List<PostLike>> GetPostLikesAsync(int postId)
        {
            return await _dbSet
                .Where(pl => pl.PostId == postId)
                .ToListAsync();
        }
    }
}