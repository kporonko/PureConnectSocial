using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Services
{
    public class SearchService : ISearchService
    {
        private readonly IPostRepository _postRepository;
        private readonly IUserRepository _userRepository;
        private readonly IFollowRepository _followRepository;
        private readonly ICacheService _cacheService;
        private readonly TimeSpan _userSearchCacheTime = TimeSpan.FromMinutes(10);

        public SearchService(
            IPostRepository postRepository,
            IUserRepository userRepository,
            IFollowRepository followRepository,
            ICacheService cacheService)
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
            _followRepository = followRepository;
            _cacheService = cacheService;
        }

        /// <summary>
        /// Gets the most popular posts (with most likes) in random order
        /// </summary>
        /// <param name="count">Number of posts to return</param>
        /// <returns>List of post images for display in feed</returns>
        public async Task<List<PostImageResponse>> GetMostPopularPosts(int count = 20)
        {
            // Используем соответствующий метод из IPostRepository
            string cacheKey = $"popular_posts_{count}";

            return await _cacheService.GetOrCreateAsync(cacheKey, async () => {
                var popularPosts = await _postRepository.GetPopularPostsAsync(count * 2);

                // Randomize the order
                var random = new Random();
                var randomizedPosts = popularPosts.OrderBy(p => random.Next()).Take(count);

                return randomizedPosts.Select(p => new PostImageResponse
                {
                    PostId = p.Id,
                    Image = p.Image
                }).ToList();
            }, TimeSpan.FromMinutes(30));
        }

        /// <summary>
        /// Gets posts that received the most likes within the specified time period
        /// </summary>
        /// <param name="hours">Time period in hours</param>
        /// <param name="count">Number of posts to return</param>
        /// <returns>List of post images for display in feed</returns>
        public async Task<List<PostImageResponse>> GetTrendingPosts(int hours = 24, int count = 20)
        {
            string cacheKey = $"trending_posts_{hours}_{count}";

            return await _cacheService.GetOrCreateAsync(cacheKey, async () => {
                var timeThreshold = DateTime.UtcNow.AddHours(-hours);
                var trendingPosts = await _postRepository.GetTrendingPostsAsync(timeThreshold, count);

                return trendingPosts.Select(p => new PostImageResponse
                {
                    PostId = p.Id,
                    Image = p.Image
                }).ToList();
            }, TimeSpan.FromMinutes(15));
        }

        /// <summary>
        /// Gets the most recent posts from popular users (users with most followers)
        /// </summary>
        /// <param name="count">Number of posts to return</param>
        /// <returns>List of post images for display in feed</returns>
        public async Task<List<PostImageResponse>> GetPostsFromPopularUsers(int count = 20)
        {
            string cacheKey = $"popular_users_posts_{count}";

            return await _cacheService.GetOrCreateAsync(cacheKey, async () => {
                // Получаем ID популярных пользователей
                var popularUsers = await _userRepository.GetMostPopularUsersAsync(10);
                var popularUserIds = popularUsers.Select(u => u.Id);

                // Получаем посты этих пользователей
                var posts = await _postRepository.GetPostsFromUsersAsync(popularUserIds, count);

                return posts.Select(p => new PostImageResponse
                {
                    PostId = p.Id,
                    Image = p.Image
                }).ToList();
            }, TimeSpan.FromMinutes(30));
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

            // Получаем текущего пользователя с его подписками
            var currentUser = await _userRepository.GetUserWithFollowsAsync(user.Id);
            if (currentUser == null)
                return new List<SearchedUserResponse>();

            // Получаем друзей текущего пользователя
            var currentUserFriends = await _userRepository.GetUserFriendsAsync(currentUser.Id);

            // Находим пользователей, чьи имена соответствуют запросу
            var matchedUsers = await _userRepository.SearchUsersAsync(searchTerm, user.Id);

            var result = new List<SearchedUserResponse>();

            foreach (var matchedUser in matchedUsers)
            {
                // Получаем друзей найденного пользователя
                var matchedUserFriends = await _userRepository.GetUserFriendsAsync(matchedUser.Id);

                // Находим общих друзей
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

        private class UserComparer : IEqualityComparer<User>
        {
            public bool Equals(User x, User y) => x?.Id == y?.Id;
            public int GetHashCode(User obj) => obj.Id.GetHashCode();
        }
    }
}