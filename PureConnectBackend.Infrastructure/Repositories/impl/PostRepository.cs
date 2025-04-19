using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Core.Repositories;
using PureConnectBackend.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PureConnectBackend.Infrastructure.Repositories.impl
{
    public class PostRepository : Repository<Post>, IPostRepository
    {
        public PostRepository(ApplicationContext context) : base(context)
        {
        }

        public async Task<Post> GetPostWithUserAsync(int postId)
        {
            return await _dbSet
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == postId);
        }

        public async Task<Post> GetPostWithDetailsAsync(int postId)
        {
            return await _dbSet
                .Include(p => p.User)
                .Include(p => p.PostLikes)
                .Include(p => p.PostComments)
                .FirstOrDefaultAsync(p => p.Id == postId);
        }

        public async Task<List<Post>> GetUserPostsAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Posts)
                    .ThenInclude(p => p.PostLikes)
                .Include(u => u.Posts)
                    .ThenInclude(p => p.PostComments)
                .FirstOrDefaultAsync(u => u.Id == userId);

            return user?.Posts.OrderByDescending(p => p.CreatedAt).ToList() ?? new List<Post>();
        }

        public async Task<List<PostImageResponse>> GetUserPostImagesAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Posts)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return new List<PostImageResponse>();

            return user.Posts
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new PostImageResponse
                {
                    PostId = p.Id,
                    Image = p.Image
                })
                .ToList();
        }

        public async Task<List<Post>> GetUserRecentPostsAsync(int userId, int daysBack)
        {
            var user = await _context.Users
                .Include(u => u.Posts)
                    .ThenInclude(p => p.PostLikes)
                .Include(u => u.Posts)
                    .ThenInclude(p => p.PostComments)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return new List<Post>();

            DateTime threshold = DateTime.Now.AddDays(-daysBack);

            return user.Posts
                .Where(p => p.CreatedAt >= threshold)
                .OrderByDescending(p => p.CreatedAt)
                .ToList();
        }

        public async Task<bool> IsPostLikedByUserAsync(int postId, int userId)
        {
            return await _context.PostsLikes
                .AnyAsync(pl => pl.PostId == postId && pl.UserId == userId);
        }

        public async Task<bool> IsUserFollowedByUserAsync(int followerId, int followeeId)
        {
            return await _context.Follows
                .AnyAsync(f => f.FollowerId == followerId && f.FolloweeId == followeeId);
        }

        public async Task<List<Post>> GetPopularPostsAsync(int count)
        {
            return await _dbSet
                .Include(p => p.PostLikes)
                .OrderByDescending(p => p.PostLikes.Count)
                .Take(count)
                .ToListAsync();
        }

        public async Task<List<Post>> GetTrendingPostsAsync(DateTime fromDate, int count)
        {
            return await _dbSet
                .Include(p => p.PostLikes)
                .Where(p => p.PostLikes.Any(l => l.CreatedAt >= fromDate))
                .OrderByDescending(p => p.PostLikes.Count(l => l.CreatedAt >= fromDate))
                .Take(count)
                .ToListAsync();
        }

        public async Task<List<Post>> GetPostsFromUsersAsync(IEnumerable<int> userIds, int count)
        {
            return await _dbSet
                .Where(p => userIds.Contains(p.UserId))
                .OrderByDescending(p => p.CreatedAt)
                .Take(count)
                .ToListAsync();
        }
    }
}