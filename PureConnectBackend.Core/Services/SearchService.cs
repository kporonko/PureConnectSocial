using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Data;
using PureConnectBackend.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Services
{
    public class SearchService : ISearchService
    {
        private readonly ApplicationContext _context;

        public SearchService(ApplicationContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets the most popular posts (with most likes) in random order
        /// </summary>
        /// <param name="count">Number of posts to return</param>
        /// <returns>List of post images for display in feed</returns>
        public async Task<List<PostImageResponse>> GetMostPopularPosts(int count = 20)
        {
            // Get posts with the most likes
            var posts = await _context.Posts
                .Include(p => p.PostLikes)
                .OrderByDescending(p => p.PostLikes.Count)
                .Take(count * 2)
                .ToListAsync();

            // Randomize the order
            var random = new Random();
            var randomizedPosts = posts.OrderBy(p => random.Next()).Take(count);

            return randomizedPosts.Select(p => new PostImageResponse
            {
                PostId = p.Id,
                Image = p.Image
            }).ToList();
        }

        /// <summary>
        /// Gets posts that received the most likes within the specified time period
        /// </summary>
        /// <param name="hours">Time period in hours</param>
        /// <param name="count">Number of posts to return</param>
        /// <returns>List of post images for display in feed</returns>
        public async Task<List<PostImageResponse>> GetTrendingPosts(int hours = 24, int count = 20)
        {
            var timeThreshold = DateTime.UtcNow.AddHours(-hours);

            // Get posts with the most recent likes
            var posts = await _context.Posts
                .Include(p => p.PostLikes)
                .Where(p => p.PostLikes.Any(l => l.CreatedAt >= timeThreshold))
                .OrderByDescending(p => p.PostLikes.Count(l => l.CreatedAt >= timeThreshold))
                .Take(count)
                .ToListAsync();

            return posts.Select(p => new PostImageResponse
            {
                PostId = p.Id,
                Image = p.Image
            }).ToList();
        }

        /// <summary>
        /// Gets the most recent posts from popular users (users with most followers)
        /// </summary>
        /// <param name="count">Number of posts to return</param>
        /// <returns>List of post images for display in feed</returns>
        public async Task<List<PostImageResponse>> GetPostsFromPopularUsers(int count = 20)
        {
            // First, get the most popular users (with most followers)
            var popularUserIds = await _context.Users
                .OrderByDescending(u => u.Follower.Count)
                .Take(10) // Take top 10 popular users
                .Select(u => u.Id)
                .ToListAsync();

            // Get recent posts from these popular users
            var posts = await _context.Posts
                .Where(p => popularUserIds.Contains(p.UserId))
                .OrderByDescending(p => p.CreatedAt)
                .Take(count)
                .ToListAsync();

            return posts.Select(p => new PostImageResponse
            {
                PostId = p.Id,
                Image = p.Image
            }).ToList();
        }
    }
}