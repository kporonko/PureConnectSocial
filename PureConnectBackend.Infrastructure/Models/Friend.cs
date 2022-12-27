using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Infrastructure.Models
{
    public class Friend
    {
        public int Id { get; set; }
        public DateTime FriendshipDateStart { get; set; }

        public int TargetId { get; set; }
        public User User { get; set; }
    }
}
