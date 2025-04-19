using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Data;
using PureConnectBackend.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Services
{
    public class UserService : IUserService
    {
        /// <summary>
        /// Entity Framework DbContext.
        /// </summary>
        private readonly ApplicationContext _context;

        public UserService(ApplicationContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets ProfileResponse info about user`s profile.
        /// </summary>
        /// <param name="user">User object with credentials from jwt.</param>
        /// <returns>ProfileResponse object with user`s data.</returns>
        public async Task<ProfileResponse?> GetProfile(User user)
        {
            var currUser = await _context.Users.FirstOrDefaultAsync(x => x.Id == user.Id);
            if (currUser is null)
                return null;

            _context.Entry(currUser).Collection(x => x.Follower).Load();
            _context.Entry(currUser).Collection(x => x.Followee).Load();
            _context.Entry(currUser).Collection(x => x.Posts).Load();


            return ConvertUserToProfileResponse(currUser);
        }

        /// <summary>
        /// Gets user`s Avatar.
        /// </summary>
        /// <param name="user">User whose avatar we are getting.</param>
        /// <returns>GetAvatarResponse object with user`s avatar.</returns>
        public async Task<GetAvatarResponse?> GetProfileAvatar(User user)
        {
            var currUser = await _context.Users.FirstOrDefaultAsync(x => x.Email == user.Email);
            if (currUser is null)
                return null;

            return new GetAvatarResponse { Avatar = currUser.Avatar };
        }

        /// <summary>
        /// Gets the list of recommended users in RecommendedUserResponse object instance.
        /// </summary>
        /// <param name="userJwt">User object credentials from jwt token.</param>
        /// <returns></returns>
        public async Task<List<RecommendedUserResponse>?> GetRecommendedUsers(User userJwt)
        {
            var currUser = await _context.Users.Include(x => x.Follower).Include(x => x.Followee).FirstOrDefaultAsync(x => x.Email == userJwt.Email);
            if (currUser is null)
                return null;

            List<User> currUserFriends = await GetUserFriends(currUser);
            Dictionary<User, int> usersWithCommonFriends = await GetUsersWithCommonFriendsByUser(currUser, currUserFriends);

            List<RecommendedUserResponse> resListOfRecommendedUsers = new List<RecommendedUserResponse>();
            if (usersWithCommonFriends.Count < 1)
                return resListOfRecommendedUsers;

            resListOfRecommendedUsers = FillListOfRecommendedUsersByUserAndCountCommonFriendsDictionary(usersWithCommonFriends, resListOfRecommendedUsers);
            return resListOfRecommendedUsers;
        }


        /// <summary>
        /// Gets user profile by id if profile is open or current user is a requested profile`s friend.
        /// </summary>
        /// <param name="currUserJwt">Current user`s credentials from jwt token.</param>
        /// <param name="requestedUserProfileId">Requested profile id.</param>
        /// <returns>ProfileResponse with data about user or empty object with error MyResponses enum value.</returns>
        public async Task<ProfilePageResponse> GetProfileById(User currUserJwt, int requestedUserProfileId)
        {
            var currUser = await _context.Users.Include(x => x.Follower).Include(x => x.Followee).FirstOrDefaultAsync(x => x.Id == currUserJwt.Id);
            var requestedUser = await _context.Users.Include(x => x.Follower).Include(x => x.Followee).Include(x => x.Posts).FirstOrDefaultAsync(x => x.Id == requestedUserProfileId);

            var responseValidator = await CheckForValidationGeProfilePage(currUser, requestedUser);
            if (responseValidator is not null)
                return responseValidator;

            return ConvertUserToProfilePageResponse(requestedUser!, currUser!);
        }

        private ProfilePageResponse ConvertUserToProfilePageResponse(User user, User currUser)
        {
            var profilePageResponse = new ProfilePageResponse()
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
            };

            profilePageResponse.PostsCount = user.Posts.Count;
            profilePageResponse.FriendsCount = GetUsersFriendsCount(user);
            profilePageResponse.FollowersCount = GetUsersFollowersCount(user);
            profilePageResponse.Response = MyResponses.Ok;
            profilePageResponse.IsFollowed = _context.Follows.Any(x => x.FollowerId == currUser.Id && x.FolloweeId == user.Id);
            
            return profilePageResponse;
        }

        private async Task<ProfilePageResponse?> CheckForValidationGeProfilePage(User? currUser, User? requestedUser)
        {
            if (currUser is null || requestedUser is null)
                return new ProfilePageResponse() { Response = MyResponses.BadRequest };

            if (!requestedUser.IsOpenAcc)
            {
                if (!await AreFriends(currUser, requestedUser))
                {
                    return new ProfilePageResponse() { Response = MyResponses.ClosedAcc };
                }
            }

            return null;
        }

        /// <summary>
        /// Checks for users objects and for account of requested user to be opened or requested user must be a friend of currUser.
        /// </summary>
        /// <param name="currUser">User object.</param>
        /// <param name="requestedUser">Requested user object.</param>
        /// <returns>Null if validation is ok. Otherwise empty ProfileResponse with response message.</returns>
        public async Task<ProfileResponse?> CheckForValidationGeProfile(User? currUser, User? requestedUser)
        {
            if (currUser is null || requestedUser is null)
                return new ProfileResponse() { Response = MyResponses.BadRequest };

            if (!requestedUser.IsOpenAcc)
            {
                if (!await AreFriends(currUser, requestedUser))
                {
                    return new ProfileResponse() { Response = MyResponses.ClosedAcc };
                }
            }

            return null;
        }


        /// <summary>
        /// Updates user`s profile.
        /// </summary>
        /// <param name="user">User to update.</param>
        /// <param name="profileEdit">New user`s data.</param>
        /// <returns>200 if user was updated. 400 if request isnt valid.</returns>
        public async Task<HttpStatusCode> EditProfile(User user, ProfileEditRequest profileEdit)
        {
            if (user is null || user.Id != profileEdit.Id)
                return HttpStatusCode.BadRequest;

            var currUser = await _context.Users.FirstOrDefaultAsync(x => x.Id == profileEdit.Id);

            if (currUser is null)
                return HttpStatusCode.BadRequest;

            return EditUser(currUser, profileEdit);
        }

        /// <summary>
        /// Gets the list of user`s followers.
        /// </summary>
        /// <param name="user">Current user making a request.</param>
        /// <returns>MyFollowersFriendsListResponse object with followers data.</returns>
        public async Task<MyFollowersFriendsListResponse> GetFollowersByUser(User user)
        {
            var currUser = await _context.Users.FirstOrDefaultAsync(x => x.Id == user.Id);
            if (currUser is null)
                return null;

            _context.Entry(currUser).Collection(x => x.Follower).Load();
            _context.Entry(currUser).Collection(x => x.Followee).Load();

            var listOfFollowers = new MyFollowersFriendsListResponse();
            var followers = await GetUserFollowers(currUser);
            foreach (var follower in followers)
            {
                var followerDto = ConvertUserToFollowerResponse (currUser, follower);
                listOfFollowers.Users.Add(followerDto);
            }

            return listOfFollowers;
        }

        /// <summary>
        /// Gets the list of user`s friends.
        /// </summary>
        /// <param name="user">Current user making a request.</param>
        /// <returns>MyFollowersFriendsListResponse object with friends data.</returns>
        public async Task<MyFollowersFriendsListResponse?> GetUserFriendsByUser(User user)
        {
            var currUser = await _context.Users.FirstOrDefaultAsync(x => x.Id == user.Id);
            if (currUser is null)
                return null;

            _context.Entry(currUser).Collection(x => x.Follower).Load();
            _context.Entry(currUser).Collection(x => x.Followee).Load();

            var listOfFriends = new MyFollowersFriendsListResponse();
            var friends = await GetUserFriends(currUser);
            foreach (var friend in friends)
            {
                var friendDto = ConvertUserToFriendResponse(currUser, friend);
                listOfFriends.Users.Add(friendDto);
            }

            return listOfFriends;
        }

        public async Task<List<CommonFriend>> GetCommonFriends(User user, int secondUserId)
        {
            var currUser = _context.Users.FirstOrDefault(x => x.Id == user.Id);
            _context.Entry(currUser).Collection(x => x.Follower).Load();
            _context.Entry(currUser).Collection(x => x.Followee).Load();

            if (currUser is null)
                return null;
            
            var secondUser = _context.Users.FirstOrDefault(x => x.Id == secondUserId);
            _context.Entry(secondUser).Collection(x => x.Follower).Load();
            _context.Entry(secondUser).Collection(x => x.Followee).Load();

            if (secondUser is null)
                return null;
            
            var currUserFriends = await GetUserFriends(currUser);
            var secondUserFriends = await GetUserFriends(secondUser);

            var commonFriends = currUserFriends.Intersect(secondUserFriends).ToList();
            return ConvertUserListToCommonFriendList(commonFriends);
        }

        private List<CommonFriend> ConvertUserListToCommonFriendList(List<User> commonFriends)
        {
            List<CommonFriend> commonFriendsResList = new List<CommonFriend>();
            foreach (var friend in commonFriends)
            {
                var commonFriendResDto = new CommonFriend()
                {
                    Id = friend.Id,
                    LastName = friend.LastName,
                    FirstName = friend.FirstName,
                    Avatar = friend.Avatar,
                    UserName = friend.UserName,
                };
                commonFriendsResList.Add(commonFriendResDto);
            }
            
            return commonFriendsResList;
        }

        private MyFollowerFriendResponse ConvertUserToFriendResponse(User currUser, User friend)
        {
            var friendDateOne = currUser.Followee.FirstOrDefault(x => x.FollowerId == friend.Id).RequestDate;
            var friendDateTwo = currUser.Follower.FirstOrDefault(x => x.FolloweeId == friend.Id).RequestDate;
            
            return new MyFollowerFriendResponse
            {
                LastName = friend.LastName,
                FirstName = friend.FirstName,
                Id = friend.Id,
                Avatar = friend.Avatar,
                UserName = friend.UserName,
                FollowDate = friendDateOne > friendDateTwo ? friendDateOne : friendDateTwo
            };
        }

        private MyFollowerFriendResponse ConvertUserToFollowerResponse(User currUser, User friend)
        {
            var friendDateOne = currUser.Followee.FirstOrDefault(x => x.FollowerId == friend.Id).RequestDate;

            return new MyFollowerFriendResponse
            {
                LastName = friend.LastName,
                FirstName = friend.FirstName,
                Id = friend.Id,
                Avatar = friend.Avatar,
                UserName = friend.UserName,
                FollowDate = friendDateOne
            };
        }
        /// <summary>
        /// Updatea user`s data in database.
        /// </summary>
        /// <param name="currUser">User to update.</param>
        /// <param name="profileEdit">New user`s data.</param>
        /// <returns>200 if user was updated.</returns>
        private HttpStatusCode EditUser(User currUser, ProfileEditRequest profileEdit)
        {
            currUser.Email = profileEdit.Email;
            currUser.FirstName = profileEdit.FirstName;
            currUser.LastName = profileEdit.LastName;
            currUser.BirthDate = profileEdit.BirthDate;
            currUser.UserName = profileEdit.UserName;
            currUser.Location = profileEdit.Location;
            currUser.Status = profileEdit.Status;
            currUser.Avatar = profileEdit.Avatar;

            _context.Users.Update(currUser);
            _context.SaveChanges();
            return HttpStatusCode.OK;
        }

        /// <summary>
        /// Converts user object to ProfileResponse instanse.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        private ProfileResponse ConvertUserToProfileResponse(User user)
        {
            var profileResponse = new ProfileResponse()
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
            };

            profileResponse.PostsCount = user.Posts.Count;
            profileResponse.FriendsCount = GetUsersFriendsCount(user);
            profileResponse.FollowersCount = GetUsersFollowersCount(user);
            profileResponse.Response = MyResponses.Ok;

            return profileResponse;
        }

        /// <summary>
        /// Gets count of user`s friends (mutual follow).
        /// </summary>
        /// <param name="user">User object.</param>
        /// <returns>Count of user`s friends.</returns>
        private int GetUsersFriendsCount(User user)
        {
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

        /// <summary>
        /// Gets user`s followers count (non-mutual follow: when user follows but not vice versa).
        /// </summary>
        /// <param name="user">User object.</param>
        /// <returns>Count of user`s followers.</returns>
        private int GetUsersFollowersCount(User user)
        {
            if (user?.Follower == null || user?.Followee == null)
                return 0;

            // ID всех, на кого подписан текущий пользователь
            var followingIds = user.Follower.Select(f => f.FolloweeId).Distinct().ToHashSet();

            // Подписчики без взаимной подписки
            return user.Followee
                .Count(follower => !followingIds.Distinct().Contains(follower.FollowerId));
        }


        /// <summary>
        /// Gets user`s friends list.
        /// </summary>
        /// <param name="currUser">User object.</param>
        /// <returns>User`s friends list.</returns>
        private async Task<List<User>> GetUserFriends(User currUser)
        {
            List<User> friends = new();
            if (currUser.Follower is null || currUser.Followee is null)
                return new List<User>();

            foreach (var follower in currUser.Followee)
            {
                var followee = currUser.Follower?.FirstOrDefault(x => x.FollowerId == currUser.Id && x.FolloweeId == follower.FollowerId);
                if (followee is not null)
                {
                    User? friend = await _context.Users.FirstOrDefaultAsync(x => x.Id == followee.FolloweeId);
                    friends.Add(friend!);
                }
            }

            return friends.Distinct().ToList();
        }

        private async Task<List<User>> GetUserFollowers(User currUser)
        {
            List<User> followers = new();
            if (currUser.Follower is null || currUser.Followee is null)
                return new List<User>();

            foreach (var follower in currUser.Followee)
            {
                var followee = currUser.Follower?.FirstOrDefault(x => x.FollowerId == currUser.Id && x.FolloweeId == follower.FollowerId);
                if (followee is null)
                {
                    User? followerUser = await _context.Users.FirstOrDefaultAsync(x => x.Id == follower.FollowerId);
                    followers.Add(followerUser!);
                }
            }

            return followers;
        }

        /// <summary>
        /// Checks whether two users are friends or not.
        /// </summary>
        /// <param name="currUser">User 1 object.</param>
        /// <param name="user">User2 object.</param>
        /// <returns>True if users are friends, False if they are not friends.</returns>
        private async Task<bool> AreFriends(User currUser, User user)
        {
            var followOneToSecond = await _context.Follows.FirstOrDefaultAsync(x => x.FollowerId == currUser.Id && x.FolloweeId == user.Id);
            var followSecondToFirst = await _context.Follows.FirstOrDefaultAsync(x => x.FollowerId == user.Id && x.FolloweeId == currUser.Id);

            return followOneToSecond is not null && followSecondToFirst is not null;
        }

        /// <summary>
        /// Checks whether two users are friends or not.
        /// </summary>
        /// <param name="currUser">User 1 object.</param>
        /// <param name="user">User2 object.</param>
        /// <returns>True if users are friends, False if they are not friends.</returns>
        private async Task<bool> IsFollower(User follower, User followee)
        {
            var follow = await _context.Follows.FirstOrDefaultAsync(x => x.FollowerId == follower.Id && x.FolloweeId == followee.Id);

            return follow is not null;
        }

        /// <summary>
        /// Converts User object to RecommendedUserResponse object.
        /// </summary>
        /// <param name="user">User object to convert.</param>
        /// <param name="commonFriendsCount">Number of common friends.</param>
        /// <returns></returns>
        private RecommendedUserResponse ConvertUserToRecommendedUserResponse(User user, int commonFriendsCount)
        {
            RecommendedUserResponse recommendedUser = new RecommendedUserResponse
            {
                CommonFriendsCount = commonFriendsCount,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserId = user.Id,
                Avatar = user.Avatar
            };

            return recommendedUser;
        }


        /// <summary>
        /// Gets dictionary with key users and value common friends count.
        /// </summary>
        /// <param name="currUser">User object that requesting recommendations.</param>
        /// <param name="currUserFriends">User`s list of friends.</param>
        /// <returns>Dictionary with user key and common friends value.</returns>
        private async Task<Dictionary<User, int>> GetUsersWithCommonFriendsByUser(User currUser, List<User> currUserFriends)
        {
            Dictionary<User, int> commonFriends = new();
            foreach (var user in _context.Users.Include(x => x.Follower).Include(x => x.Followee).Where(x => x.Id != currUser.Id))
            {
                List<User> currentUserInDbFriends = await GetUserFriends(user);
                //List<User> commonFriends = currentUserInDbFriends.Intersect(currUserFriends).ToList();
                int commonFriendsCount = currentUserInDbFriends.Intersect(currUserFriends).ToList().Count;
                if (commonFriendsCount > 0 && !await IsFollower(currUser, user))
                {
                    commonFriends.Add(user, commonFriendsCount);
                }
            }

            return commonFriends;
        }

        /// <summary>
        /// Fills list by RecommendedUserResponse objects with most count of recommended friends.
        /// </summary>
        /// <param name="usersWithCommonFriends">Dictionary of users and their common friends.</param>
        /// <param name="resListOfRecommendedUsers">Resultive list of RecommendedUserResponse objects that we want to fill by data.</param>
        /// <returns>Resultive list of RecommendedUserResponse objects filled by data from dictionary.</returns>
        private List<RecommendedUserResponse> FillListOfRecommendedUsersByUserAndCountCommonFriendsDictionary(Dictionary<User, int> usersWithCommonFriends, List<RecommendedUserResponse> resListOfRecommendedUsers)
        {
            usersWithCommonFriends = usersWithCommonFriends.OrderBy(x => x.Value).ToDictionary(x => x.Key, x => x.Value);

            foreach (var user in usersWithCommonFriends.Keys)
            {
                RecommendedUserResponse recommendedUserDtoObject = ConvertUserToRecommendedUserResponse(user, usersWithCommonFriends[user]);
                resListOfRecommendedUsers.Add(recommendedUserDtoObject);
            }

            return resListOfRecommendedUsers;
        }
    }
}
