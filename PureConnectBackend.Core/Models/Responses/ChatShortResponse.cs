using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Models.Responses
{
    public class ChatShortResponse
    {
        public List<ChatShort> Chats { get; set; }
    }

    public class ChatShort
    {
        public int ChatId { get; set; }
        public string ChatAvatar { get; set; }
        public LastMessage Lastmessage { get; set; }
        public string Name { get; set; }
    }

    public class LastMessage
    {
        public int MessageId { get; set; }
        public string MessageText { get; set; }
        public string SenderUsername { get; set; }
        public DateTime SendDate { get; set; }
    }
}
