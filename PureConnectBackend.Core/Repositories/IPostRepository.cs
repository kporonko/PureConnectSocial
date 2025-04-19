using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Responses;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Repositories
{
    public interface IPostRepository : IRepository<Post>
    {
        Task<Post> GetPostWithUserAsync(int postId);
        Task<Post> GetPostWithDetailsAsync(int postId);
        Task<List<Post>> GetUserPostsAsync(int userId);
        Task<List<PostImageResponse>> GetUserPostImagesAsync(int userId);
        Task<List<Post>> GetUserRecentPostsAsync(int userId, int daysBack);
        Task<bool> IsPostLikedByUserAsync(int postId, int userId);
        Task<bool> IsUserFollowedByUserAsync(int followerId, int followeeId);
        Task<List<Post>> GetPopularPostsAsync(int count);
        Task<List<Post>> GetTrendingPostsAsync(DateTime fromDate, int count);
        Task<List<Post>> GetPostsFromUsersAsync(IEnumerable<int> userIds, int count);
    }
}