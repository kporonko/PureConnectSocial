using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models;
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
        private readonly ICacheService _cacheService;
        private readonly TimeSpan _userSearchCacheTime = TimeSpan.FromMinutes(10);

        public SearchService(ApplicationContext context, ICacheService cacheService)
        {
            _context = context;
            _cacheService = cacheService;
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

        public async Task<List<SearchedUserResponse>> GetSearchedUsers(User user, string userName)
        {
            // Формируем ключ кеша на основе ID пользователя и поискового запроса
            string cacheKey = $"user_search_{user.Id}_{userName.ToLower()}";

            // Получаем данные из кеша или создаем новые
            return await _cacheService.GetOrCreateAsync(cacheKey, async () =>
            {
                return await PerformUserSearch(user, userName);
            }, _userSearchCacheTime);
        }

        // Выделяем логику поиска в отдельный метод
        private async Task<List<SearchedUserResponse>> PerformUserSearch(User user, string userName)
        {
            var searchTerm = userName.ToLower();

            var currentUser = await _context.Users
                .Include(u => u.Followee)
                .Include(u => u.Follower)
                .FirstOrDefaultAsync(u => u.Id == user.Id);

            if (currentUser == null)
                return new List<SearchedUserResponse>();

            var currentUserFriends = await GetUserFriends(currentUser);

            var matchedUsers = await _context.Users
                .Where(u => u.Id != user.Id)
                .Where(u => u.UserName.ToLower().Contains(searchTerm) || u.FirstName.ToLower().Contains(searchTerm) || u.LastName.ToLower().Contains(searchTerm))
                .Include(u => u.Follower)
                .Include(u => u.Followee)
                .ToListAsync();

            var result = new List<SearchedUserResponse>();

            foreach (var matchedUser in matchedUsers)
            {
                var matchedUserFriends = await GetUserFriends(matchedUser);

                var commonFriendsCount = currentUserFriends
                    .Intersect(matchedUserFriends, new UserComparer())
                    .Count();

                result.Add(new SearchedUserResponse
                {
                    Avatar = matchedUser.Avatar,
                    FirstName = matchedUser.FirstName,
                    LastName = matchedUser.LastName,
                    UserId = matchedUser.Id,
                    CommonFriendsCount = commonFriendsCount,
                    Username = matchedUser.UserName
                });
            }

            return result.OrderByDescending(x => x.CommonFriendsCount).ToList();
        }

        private async Task<List<User>> GetUserFriends(User user)
        {
            var followingIds = await _context.Follows
                .Where(f => f.FollowerId == user.Id)
                .Select(f => f.FolloweeId)
                .Distinct() // Добавляем Distinct для исключения дубликатов
                .ToListAsync();

            // Затем получаем ID пользователей, которые подписаны на текущего пользователя
            var followerIds = await _context.Follows
                .Where(f => f.FolloweeId == user.Id)
                .Select(f => f.FollowerId)
                .Distinct() // Добавляем Distinct для исключения дубликатов
                .ToListAsync();

            // Находим пересечение - это ID взаимных друзей
            var mutualFriendIds = followingIds.Intersect(followerIds).ToList();

            // Получаем полную информацию о пользователях
            var mutualFriends = await _context.Users
                .Where(u => mutualFriendIds.Contains(u.Id))
                .ToListAsync();

            return mutualFriends;
        }

        private class UserComparer : IEqualityComparer<User>
        {
            public bool Equals(User x, User y) => x?.Id == y?.Id;
            public int GetHashCode(User obj) => obj.Id.GetHashCode();
        }
    }
}