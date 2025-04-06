using PureConnectBackend.Core.Models.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Interfaces
{
    public interface ISearchService
    {
        /// <summary>
        /// Gets the most popular posts (with most likes) in random order
        /// </summary>
        /// <param name="count">Number of posts to return</param>
        /// <returns>List of post images for display in feed</returns>
        Task<List<PostImageResponse>> GetMostPopularPosts(int count = 20);

        /// <summary>
        /// Gets posts that received the most likes within the specified time period
        /// </summary>
        /// <param name="hours">Time period in hours</param>
        /// <param name="count">Number of posts to return</param>
        /// <returns>List of post images for display in feed</returns>
        Task<List<PostImageResponse>> GetTrendingPosts(int hours = 24, int count = 20);

        /// <summary>
        /// Gets the most recent posts from popular users (users with most followers)
        /// </summary>
        /// <param name="count">Number of posts to return</param>
        /// <returns>List of post images for display in feed</returns>
        Task<List<PostImageResponse>> GetPostsFromPopularUsers(int count = 20);
    }
}