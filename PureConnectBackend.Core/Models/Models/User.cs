using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Models.Models
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public DateTime BirthDate { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool IsOpenAcc { get; set; }
        public string Location { get; set; }
        public string Status { get; set; }
        public string Avatar { get; set; }
        public string Role { get; set; }

        public List<Follow> Follower { get; set; }
        public List<Follow> Followee { get; set; }
        public List<Post> Posts { get; set; }
        public List<PostLike> PostsLikes { get; set; }

        public List<PostComment> PostsComments { get; set; }
        public List<PostCommentLike> PostsCommentsLikes { get; set; }

        public List<PostReport> PostsReports { get; set; }
        public List<Report> Reports { get; set; }
        public List<ChatParticipant> ChatParticipants { get; set; }
    }
}
