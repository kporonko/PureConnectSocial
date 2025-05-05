using System;

namespace PureConnectBackend.Core.Models.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }
        public int ChatParticipantId { get; set; }
        public ChatParticipant ChatParticipant { get; set; }
    }
} 