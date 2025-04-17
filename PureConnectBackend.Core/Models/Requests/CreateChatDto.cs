using PureConnectBackend.Infrastructure.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Models.Requests
{
    public class CreateChatDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ChatType Type { get; set; }
        public List<int> ParticipantsIds { get; set; }
    }
}
