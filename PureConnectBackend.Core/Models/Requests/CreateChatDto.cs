using PureConnectBackend.Core.Enums;

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
