using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Models.Responses
{
    public class ProfilePageResponse
    {
        public int UserId { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string? Avatar { get; set; }
        public string? Location { get; set; }
        public DateTime BirthDate { get; set; }
        public string? Status { get; set; }
        public int PostsCount { get; set; }
        public int FollowersCount { get; set; }
        public int FriendsCount { get; set; }
        public bool IsFollowed { get; set; }
        public MyResponses? Response { get; set; }
    }
}
