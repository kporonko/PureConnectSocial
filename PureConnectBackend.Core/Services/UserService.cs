using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Data;
using PureConnectBackend.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
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
            var currUser = await _context.Users.Include(x => x.Follower).Include(x => x.Followee).Include(x => x.Posts).FirstOrDefaultAsync(x => x.Email == user.Email);
            if (currUser is null)
                return null;

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
        public async Task<ProfileResponse> GetProfileById(User currUserJwt, int requestedUserProfileId)
        {
            var currUser = await _context.Users.Include(x => x.Follower).Include(x => x.Followee).FirstOrDefaultAsync(x => x.Id == currUserJwt.Id);
            var requestedUser = await _context.Users.Include(x => x.Follower).Include(x => x.Followee).Include(x => x.Posts).FirstOrDefaultAsync(x => x.Id == requestedUserProfileId);

            var responseValidator = await CheckForValidationGeProfile(currUser, requestedUser);
            if (responseValidator is not null)
                return responseValidator;

            return ConvertUserToProfileResponse(requestedUser);
        }

        /// <summary>
        /// Checks for users objects and for account of requested user to be opened or requested user must be a friend of currUser.
        /// </summary>
        /// <param name="currUser">User object.</param>
        /// <param name="requestedUser">Requested user object.</param>
        /// <returns>Null if validation is ok. Otherwise empty ProfileResponse with response message.</returns>
        private async Task<ProfileResponse?> CheckForValidationGeProfile(User? currUser, User? requestedUser)
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
            int counter = 0;

            foreach (var follower in user.Followee)
            {
                var followee = user.Follower.FirstOrDefault(x => x.FollowerId == user.Id && x.FolloweeId == follower.FollowerId);
                if (followee is not null)
                {
                    counter++;
                }
            }

            return counter;
        }

        /// <summary>
        /// Gets user`s followers count (non-mutual follow: when user follows but not vice versa).
        /// </summary>
        /// <param name="user">User object.</param>
        /// <returns>Count of user`s followers.</returns>
        private int GetUsersFollowersCount(User user)
        {
            int counter = 0;

            foreach (var follower in user.Followee)
            {
                var followee = user.Follower.FirstOrDefault(x => x.FollowerId == user.Id && x.FolloweeId == follower.FollowerId);
                if (followee is null)
                {
                    counter++;
                }
            }

            return counter;
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

            return friends;
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
