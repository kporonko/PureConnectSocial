using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Models;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Core.Repositories;
using PureConnectBackend.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace PureConnectBackend.Infrastructure.Repositories.impl
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        private readonly IFollowRepository _followRepository;

        public UserRepository(ApplicationContext context, IFollowRepository followRepository) : base(context)
        {
            _followRepository = followRepository;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task<User> GetUserByCredentialsAsync(string email, string passwordHash)
        {
            return await _dbSet.FirstOrDefaultAsync(x =>
                x.Email == email &&
                x.Password == passwordHash);
        }

        public async Task<User> GetUserWithDetailsAsync(int userId)
        {
            return await _dbSet
                .Include(u => u.Follower)
                .Include(u => u.Followee)
                .Include(u => u.Posts)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<List<User>> GetUserFriendsAsync(int userId)
        {
            var user = await GetUserWithDetailsAsync(userId);
            if (user == null || user.Follower == null || user.Followee == null)
                return new List<User>();

            var friends = new List<User>();
            foreach (var follower in user.Followee)
            {
                var followee = user.Follower.FirstOrDefault(x =>
                    x.FollowerId == user.Id &&
                    x.FolloweeId == follower.FollowerId);

                if (followee != null)
                {
                    var friend = await _dbSet.FirstOrDefaultAsync(x => x.Id == followee.FolloweeId);
                    if (friend != null)
                        friends.Add(friend);
                }
            }

            return friends.Distinct().ToList();
        }

        public async Task<List<User>> GetUserFollowersAsync(int userId)
        {
            var user = await GetUserWithDetailsAsync(userId);
            if (user == null || user.Follower == null || user.Followee == null)
                return new List<User>();

            var followers = new List<User>();
            foreach (var follower in user.Followee)
            {
                var followee = user.Follower.FirstOrDefault(x =>
                    x.FollowerId == user.Id &&
                    x.FolloweeId == follower.FollowerId);

                if (followee == null)
                {
                    var followerUser = await _dbSet.FirstOrDefaultAsync(x => x.Id == follower.FollowerId);
                    if (followerUser != null)
                        followers.Add(followerUser);
                }
            }

            return followers;
        }

        public async Task<List<CommonFriend>> GetCommonFriendsAsync(int userId1, int userId2)
        {
            var user1Friends = await GetUserFriendsAsync(userId1);
            var user2Friends = await GetUserFriendsAsync(userId2);

            var commonFriends = user1Friends.Intersect(user2Friends).ToList();
            return commonFriends.Select(friend => new CommonFriend
            {
                Id = friend.Id,
                LastName = friend.LastName,
                FirstName = friend.FirstName,
                Avatar = friend.Avatar,
                UserName = friend.UserName
            }).ToList();
        }

        public async Task<ProfileResponse> GetUserProfileAsync(int userId)
        {
            var user = await GetUserWithDetailsAsync(userId);
            if (user == null)
                return null;

            return new ProfileResponse
            {
                Email = user.Email,
                Status = user.Status,
                Avatar = user.Avatar,
                LastName = user.LastName,
                FirstName = user.FirstName,
                UserName = user.UserName,
                BirthDate = user.BirthDate,
                UserId = user.Id,
                Location = user.Location,
                PostsCount = user.Posts?.Count ?? 0,
                FriendsCount = await GetUserFriendsCountAsync(user.Id),
                FollowersCount = await GetUserFollowersCountAsync(user.Id),
                Response = MyResponses.Ok
            };
        }

        public async Task<ProfilePageResponse> GetUserProfilePageAsync(int userId, int currentUserId)
        {
            var user = await GetUserWithDetailsAsync(userId);
            if (user == null)
                return null;

            var isFollowed = await _followRepository.GetFollowAsync(currentUserId, userId) != null;

            return new ProfilePageResponse
            {
                Email = user.Email,
                Status = user.Status,
                Avatar = user.Avatar,
                LastName = user.LastName,
                FirstName = user.FirstName,
                UserName = user.UserName,
                BirthDate = user.BirthDate,
                UserId = user.Id,
                Location = user.Location,
                PostsCount = user.Posts?.Count ?? 0,
                FriendsCount = await GetUserFriendsCountAsync(user.Id),
                FollowersCount = await GetUserFollowersCountAsync(user.Id),
                Response = MyResponses.Ok,
                IsFollowed = isFollowed,
                IsMine = userId == currentUserId
            };
        }

        public async Task<GetAvatarResponse> GetUserAvatarAsync(string email)
        {
            var user = await GetUserByEmailAsync(email);
            if (user == null)
                return null;

            return new GetAvatarResponse { Avatar = user.Avatar };
        }

        public async Task<List<RecommendedUserResponse>> GetRecommendedUsersAsync(int userId)
        {
            var user = await GetUserWithDetailsAsync(userId);
            if (user == null)
                return new List<RecommendedUserResponse>();

            var userFriends = await GetUserFriendsAsync(userId);

            var result = new List<RecommendedUserResponse>();
            var otherUsers = await _dbSet
                .Include(u => u.Follower)
                .Include(u => u.Followee)
                .Where(u => u.Id != userId)
                .ToListAsync();

            foreach (var otherUser in otherUsers)
            {
                var otherUserFriends = await GetUserFriendsAsync(otherUser.Id);
                var commonFriendsCount = otherUserFriends.Intersect(userFriends).Count();

                var isFollower = await _followRepository.GetFollowAsync(userId, otherUser.Id) != null;

                if (commonFriendsCount > 0 && !isFollower)
                {
                    result.Add(new RecommendedUserResponse
                    {
                        CommonFriendsCount = commonFriendsCount,
                        FirstName = otherUser.FirstName,
                        LastName = otherUser.LastName,
                        UserId = otherUser.Id,
                        Avatar = otherUser.Avatar
                    });
                }
            }

            return result.OrderByDescending(u => u.CommonFriendsCount).ToList();
        }

        public async Task<HttpStatusCode> UpdateUserProfileAsync(User user, ProfileEditRequest profileEdit)
        {
            var dbUser = await _dbSet.FirstOrDefaultAsync(u => u.Id == profileEdit.Id);
            if (dbUser == null)
                return HttpStatusCode.BadRequest;

            dbUser.Email = profileEdit.Email;
            dbUser.FirstName = profileEdit.FirstName;
            dbUser.LastName = profileEdit.LastName;
            dbUser.BirthDate = profileEdit.BirthDate;
            dbUser.UserName = profileEdit.UserName;
            dbUser.Location = profileEdit.Location;
            dbUser.Status = profileEdit.Status;
            dbUser.Avatar = profileEdit.Avatar;

            await UpdateAsync(dbUser);
            await SaveChangesAsync();

            return HttpStatusCode.OK;
        }

        public async Task<bool> IsOpenAccountAsync(int userId)
        {
            var user = await _dbSet.FirstOrDefaultAsync(u => u.Id == userId);
            return user?.IsOpenAcc ?? false;
        }

        public async Task<bool> AreFriendsAsync(int userId1, int userId2)
        {
            var follow1 = await _followRepository.GetFollowAsync(userId1, userId2);
            var follow2 = await _followRepository.GetFollowAsync(userId2, userId1);

            return follow1 != null && follow2 != null;
        }

        public async Task<bool> IsFollowerAsync(int followerId, int followeeId)
        {
            return await _followRepository.GetFollowAsync(followerId, followeeId) != null;
        }

        public async Task<int> GetUserFriendsCountAsync(int userId)
        {
            var user = await GetUserWithDetailsAsync(userId);
            if (user?.Follower == null || user?.Followee == null)
                return 0;

            // Получаем уникальные ID пользователей, на которых подписан текущий пользователь
            var followingIds = user.Follower
                .Select(f => f.FolloweeId)
                .Distinct()
                .ToHashSet();

            // Считаем подписчиков, которые есть в списке подписок
            return user.Followee
                .Select(f => f.FollowerId)
                .Distinct()
                .Count(id => followingIds.Contains(id));
        }

        public async Task<int> GetUserFollowersCountAsync(int userId)
        {
            var user = await GetUserWithDetailsAsync(userId);
            if (user?.Follower == null || user?.Followee == null)
                return 0;

            // ID всех, на кого подписан текущий пользователь
            var followingIds = user.Follower
                .Select(f => f.FolloweeId)
                .Distinct()
                .ToHashSet();

            // Подписчики без взаимной подписки
            return user.Followee
                .Count(follower => !followingIds.Contains(follower.FollowerId));
        }

        public async Task<User> GetUserWithFollowsAsync(int userId)
        {
            return await _dbSet
                .Include(u => u.Followee)
                .Include(u => u.Follower)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<List<User>> GetMostPopularUsersAsync(int count)
        {
            return await _dbSet
                .OrderByDescending(u => u.Follower.Count)
                .Take(count)
                .ToListAsync();
        }

        public async Task<List<User>> SearchUsersAsync(string searchTerm, int excludeUserId)
        {
            return await _dbSet
                .Where(u => u.Id != excludeUserId)
                .Where(u => u.UserName.ToLower().Contains(searchTerm) ||
                            u.FirstName.ToLower().Contains(searchTerm) ||
                            u.LastName.ToLower().Contains(searchTerm))
                .Include(u => u.Follower)
                .Include(u => u.Followee)
                .ToListAsync();
        }
    }
}