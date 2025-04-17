using System;

namespace PureConnectBackend.Infrastructure.Models
{
    public class ChatParticipant
    {
        public int Id { get; set; }
        public int ChatId { get; set; }
        public Chat Chat { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public DateTime? JoinedAt { get; set; }

        public List<Message> Messages { get; set; }
    }
} 