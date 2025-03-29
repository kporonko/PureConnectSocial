using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Models.Responses
{
    public class MessageResponse
    {
        public int MessageId { get; set; }

        public int SenderId { get; set; }

        public string MessageText { get; set; }

    }
}
