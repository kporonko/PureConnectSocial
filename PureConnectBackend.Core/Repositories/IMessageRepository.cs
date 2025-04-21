using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Repositories
{
    public interface IMessageRepository : IRepository<Message>
    {
        Task<List<Message>> GetChatMessagesAsync(int chatId);
        Task<Message> GetLastMessageAsync(int chatId);
    }
}