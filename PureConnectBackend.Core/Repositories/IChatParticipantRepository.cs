using PureConnectBackend.Core.Models.Models;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Repositories
{
    public interface IChatParticipantRepository : IRepository<ChatParticipant>
    {
        Task<ChatParticipant> GetParticipantAsync(int chatId, int userId);
        Task<bool> IsParticipantAsync(int chatId, int userId);
    }
}