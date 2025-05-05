using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Models.Requests
{
    public class MessageSignalRModel
    {
        public int MessageId { get; set; }
        public string MessageText { get; set; }
        public DateTime MessageDate { get; set; }
        public int SenderId { get; set; }

    }
}
