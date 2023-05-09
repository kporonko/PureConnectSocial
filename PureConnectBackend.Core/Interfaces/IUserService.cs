using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Interfaces
{
    public interface IUserService
    {
        public Task<GetAvatarResponse?> GetProfileAvatar(User user);
        public Task<List<RecommendedUserResponse>?> GetRecommendedUsers(User user);
        public Task<ProfileResponse?> GetProfile(User user);
        public Task<ProfileResponse> GetProfileById (User currUser, int requestedUserProfileId);

        public Task<HttpStatusCode> EditProfile(User user, ProfileEditRequest profileEdit);
        public Task<MyFollowersFriendsListResponse> GetMyFollowers(User user);
        public Task<MyFollowersFriendsListResponse> GetMyFriends(User user);
        public Task<List<CommonFriend>> GetCommonFriends(User user, int secondUserId);

    }
}
