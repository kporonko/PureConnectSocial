using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Infrastructure.Models
{
    public class PostCommentLike
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }

        public PostComment PostComment { get; set; }
        public int PostCommentId { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
    }
}
