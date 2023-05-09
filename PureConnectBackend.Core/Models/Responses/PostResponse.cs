using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Models.Responses
{
    public class PostResponse
    {
        public int PostId { get; set; }
        public string? Image { get; set; }
        public string Description { get; set; }
        public int LikesCount { get; set; }
        public int CommentsCount { get; set; }
        public DateTime CreatedAt { get; set; }

        public string? Avatar { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public bool IsLike { get; set; }

        public bool IsMine { get; set; }
        public MyResponses Response { get; set; }
    }
}
