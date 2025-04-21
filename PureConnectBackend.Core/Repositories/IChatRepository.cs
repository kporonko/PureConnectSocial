using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Repositories
{
    public interface IChatRepository : IRepository<Chat>
    {
        Task<Chat> GetChatWithParticipantsAsync(int chatId);
        Task<List<Chat>> GetUserChatsWithParticipantsAsync(int userId);
    }
}