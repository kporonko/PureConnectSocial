using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Models.Responses
{
    public class ChatResponse
    {
        public int ChatId { get; set; }
        public List<Participant> Participants { get; set; }
        public List<MessageInChatResponse> Messages { get; set; }
    }

    public class Participant
    {
        public int ParticipantId { get; set; }
        public string Avatar { get; set; }
        public string FullName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
    }

    public class MessageInChatResponse
    {
        public int MessageId { get; set; }
        public string MessageText { get; set; }
        public string MessageDate { get; set; }
        public string SenderId { get; set; }
        public string Email { get; set; }
    }
}
