using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Infrastructure.Models
{
    public class Follower
    {
        public int Id { get; set; }
        public DateTime RequestDate { get; set; }

        public int TargetId { get; set; }
        public User User { get; set; }

    }
}
