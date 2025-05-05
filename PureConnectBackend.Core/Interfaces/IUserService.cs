using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using System.Net;

namespace PureConnectBackend.Core.Interfaces
{
    public interface IUserService
    {
        public Task<GetAvatarResponse?> GetProfileAvatar(User user);
        public Task<List<RecommendedUserResponse>?> GetRecommendedUsers(User user);
        public Task<ProfileResponse?> GetProfile(User user);
        public Task<ProfilePageResponse> GetProfileById (User currUser, int requestedUserProfileId);

        public Task<HttpStatusCode> EditProfile(User user, ProfileEditRequest profileEdit);
        public Task<MyFollowersFriendsListResponse> GetFollowersByUser(User user, User? currentUser);
        public Task<MyFollowersFriendsListResponse> GetUserFriendsByUser(User user, User? currentUser);
        public Task<List<CommonFriend>> GetCommonFriends(User user, int secondUserId);

    }
}
