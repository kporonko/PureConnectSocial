using PureConnectBackend.Core.Enums;
using System;
using System.Collections.Generic;

namespace PureConnectBackend.Core.Models.Models
{
    public class Chat
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ChatType ChatType { get; set; }
        public ICollection<ChatParticipant> ChatParticipants { get; set; }
    }
} 