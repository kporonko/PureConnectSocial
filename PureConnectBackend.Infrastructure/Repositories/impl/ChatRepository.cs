using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Repositories;
using PureConnectBackend.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PureConnectBackend.Infrastructure.Repositories.impl
{
    public class ChatRepository : Repository<Chat>, IChatRepository
    {
        public ChatRepository(ApplicationContext context) : base(context)
        {
        }

        public async Task<Chat> GetChatWithParticipantsAsync(int chatId)
        {
            return await _context.Chats
                .Include(c => c.ChatParticipants)
                    .ThenInclude(cp => cp.User)
                .FirstOrDefaultAsync(c => c.Id == chatId);
        }

        public async Task<List<Chat>> GetUserChatsWithParticipantsAsync(int userId)
        {
            return await _context.Chats
                .Include(c => c.ChatParticipants)
                    .ThenInclude(cp => cp.User)
                .Where(c => c.ChatParticipants.Any(cp => cp.UserId == userId))
                .ToListAsync();
        }
    }
}