using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Core.Repositories;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IFollowRepository _followRepository;

        public UserService(IUserRepository userRepository, IFollowRepository followRepository)
        {
            _userRepository = userRepository;
            _followRepository = followRepository;
        }

        public async Task<ProfileResponse> GetProfile(User user)
        {
            return await _userRepository.GetUserProfileAsync(user.Id);
        }

        public async Task<GetAvatarResponse> GetProfileAvatar(User user)
        {
            return await _userRepository.GetUserAvatarAsync(user.Email);
        }

        public async Task<List<RecommendedUserResponse>> GetRecommendedUsers(User userJwt)
        {
            return await _userRepository.GetRecommendedUsersAsync(userJwt.Id);
        }

        public async Task<ProfilePageResponse> GetProfileById(User currUserJwt, int requestedUserProfileId)
        {
            // Проверка доступа к профилю
            var validationResult = await CheckForValidationGeProfilePage(currUserJwt, requestedUserProfileId);
            if (validationResult != null)
                return validationResult;

            return await _userRepository.GetUserProfilePageAsync(requestedUserProfileId, currUserJwt.Id);
        }

        public async Task<HttpStatusCode> EditProfile(User user, ProfileEditRequest profileEdit)
        {
            if (user == null || user.Id != profileEdit.Id)
                return HttpStatusCode.BadRequest;

            return await _userRepository.UpdateUserProfileAsync(user, profileEdit);
        }

        public async Task<MyFollowersFriendsListResponse> GetFollowersByUser(User user, User? currentUser)
        {
            var followers = await _userRepository.GetUserFollowersAsync(user.Id);

            var response = new MyFollowersFriendsListResponse();
            response.Users = new List<MyFollowerFriendResponse>();

            foreach (var follower in followers)
            {
                var follow = await _followRepository.GetFollowAsync(follower.Id, user.Id);

                if (follow != null)
                {
                    var isFollowed = await _followRepository.GetFollowAsync(currentUser != null ? currentUser.Id : user.Id, follow.FollowerId) != null;

                    response.Users.Add(new MyFollowerFriendResponse
                    {
                        Id = follower.Id,
                        FirstName = follower.FirstName,
                        LastName = follower.LastName,
                        Avatar = follower.Avatar,
                        UserName = follower.UserName,
                        FollowDate = follow.RequestDate,
                        IsFollowed = isFollowed
                    });
                }
            }

            return response;
        }

        public async Task<MyFollowersFriendsListResponse> GetUserFriendsByUser(User user, User? currentUser)
        {
            var friends = await _userRepository.GetUserFriendsAsync(user.Id);

            var response = new MyFollowersFriendsListResponse();
            response.Users = new List<MyFollowerFriendResponse>();

            foreach (var friend in friends)
            {
                var follow1 = await _followRepository.GetFollowAsync(user.Id, friend.Id);
                var follow2 = await _followRepository.GetFollowAsync(friend.Id, user.Id);

                if (follow1 != null && follow2 != null)
                {
                    var laterDate = follow1.RequestDate > follow2.RequestDate ? follow1.RequestDate : follow2.RequestDate;

                    var isFollowed = await _followRepository.GetFollowAsync(currentUser != null ? currentUser.Id : user.Id, friend.Id) != null;

                    response.Users.Add(new MyFollowerFriendResponse
                    {
                        Id = friend.Id,
                        FirstName = friend.FirstName,
                        LastName = friend.LastName,
                        Avatar = friend.Avatar,
                        UserName = friend.UserName,
                        FollowDate = laterDate,
                        IsFollowed = isFollowed
                    });
                }
            }

            return response;
        }

        public async Task<List<CommonFriend>> GetCommonFriends(User user, int secondUserId)
        {
            return await _userRepository.GetCommonFriendsAsync(user.Id, secondUserId);
        }

        public async Task<ProfileResponse> CheckForValidationGeProfile(User currUser, User requestedUser)
        {
            if (currUser == null || requestedUser == null)
                return new ProfileResponse { Response = MyResponses.BadRequest };

            var isOpenAccount = await _userRepository.IsOpenAccountAsync(requestedUser.Id);
            if (!isOpenAccount)
            {
                var areFriends = await _userRepository.AreFriendsAsync(currUser.Id, requestedUser.Id);
                if (!areFriends)
                {
                    return new ProfileResponse { Response = MyResponses.ClosedAcc };
                }
            }

            return null;
        }

        private async Task<ProfilePageResponse> CheckForValidationGeProfilePage(User currUser, int requestedUserId)
        {
            var requestedUser = await _userRepository.GetByIdAsync(requestedUserId);
            if (currUser == null || requestedUser == null)
                return new ProfilePageResponse { Response = MyResponses.BadRequest };

            var isOpenAccount = await _userRepository.IsOpenAccountAsync(requestedUserId);
            if (!isOpenAccount)
            {
                var areFriends = await _userRepository.AreFriendsAsync(currUser.Id, requestedUserId);
                if (!areFriends)
                {
                    return new ProfilePageResponse { Response = MyResponses.ClosedAcc };
                }
            }

            return null;
        }
    }
}