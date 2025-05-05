using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Repositories;
using PureConnectBackend.Infrastructure.Data;
using System.Threading.Tasks;

namespace PureConnectBackend.Infrastructure.Repositories.impl
{
    public class ChatParticipantRepository : Repository<ChatParticipant>, IChatParticipantRepository
    {
        public ChatParticipantRepository(ApplicationContext context) : base(context)
        {
        }

        public async Task<ChatParticipant> GetParticipantAsync(int chatId, int userId)
        {
            return await _context.ChatParticipants
                .FirstOrDefaultAsync(cp => cp.ChatId == chatId && cp.UserId == userId);
        }

        public async Task<bool> IsParticipantAsync(int chatId, int userId)
        {
            return await _context.ChatParticipants
                .AnyAsync(cp => cp.ChatId == chatId && cp.UserId == userId);
        }
    }
}