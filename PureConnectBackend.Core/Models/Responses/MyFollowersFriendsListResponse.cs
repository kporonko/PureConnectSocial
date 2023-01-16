using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Models.Responses
{
    public class MyFollowersFriendsListResponse
    {
        public List<MyFollowerFriendResponse> Users { get; set; } = new List<MyFollowerFriendResponse>();
    }
}
