using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Infrastructure.Models
{
    public class PostComment
    {
        public int Id { get; set; }
        public string CommentText { get; set; }
        public DateTime CreatedAt { get; set; }

        public int PostId { get; set; }
        public Post Post { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        public int? ParentCommentId { get; set; }
        public PostComment ParentComment { get; set; }
        public List<PostComment> CommentReplies { get; set; }

        public List<PostCommentLike> PostCommentLikes { get; set; }
    }
}
