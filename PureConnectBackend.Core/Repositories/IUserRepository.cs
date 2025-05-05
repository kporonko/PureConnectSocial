using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByCredentialsAsync(string email, string passwordHash);
        Task<User> GetUserWithDetailsAsync(int userId);
        Task<List<User>> GetUserFriendsAsync(int userId);
        Task<List<User>> GetUserFollowersAsync(int userId);
        Task<List<CommonFriend>> GetCommonFriendsAsync(int userId1, int userId2);
        Task<ProfileResponse> GetUserProfileAsync(int userId);
        Task<ProfilePageResponse> GetUserProfilePageAsync(int userId, int currentUserId);
        Task<GetAvatarResponse> GetUserAvatarAsync(string email);
        Task<List<RecommendedUserResponse>> GetRecommendedUsersAsync(int userId);
        Task<HttpStatusCode> UpdateUserProfileAsync(User user, ProfileEditRequest profileEdit);
        Task<bool> IsOpenAccountAsync(int userId);
        Task<bool> AreFriendsAsync(int userId1, int userId2);
        Task<bool> IsFollowerAsync(int followerId, int followeeId);
        Task<int> GetUserFriendsCountAsync(int userId);
        Task<int> GetUserFollowersCountAsync(int userId);
        Task<User> GetUserWithFollowsAsync(int userId);
        Task<List<User>> GetMostPopularUsersAsync(int count);
        Task<List<User>> SearchUsersAsync(string searchTerm, int excludeUserId);
    }
}