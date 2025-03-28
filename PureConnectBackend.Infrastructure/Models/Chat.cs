using PureConnectBackend.Infrastructure.Enums;
using System;
using System.Collections.Generic;

namespace PureConnectBackend.Infrastructure.Models
{
    public class Chat
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ChatType ChatType { get; set; }
        public ICollection<ChatParticipant> ChatParticipants { get; set; }
    }
} 