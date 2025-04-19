using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Repositories;
using PureConnectBackend.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PureConnectBackend.Infrastructure.Repositories.impl
{
    public class MessageRepository : Repository<Message>, IMessageRepository
    {
        public MessageRepository(ApplicationContext context) : base(context)
        {
        }

        public async Task<List<Message>> GetChatMessagesAsync(int chatId)
        {
            return await _context.Messages
                .Include(m => m.ChatParticipant)
                    .ThenInclude(cp => cp.User)
                .Where(m => m.ChatParticipant.ChatId == chatId)
                .OrderBy(m => m.Timestamp)
                .ToListAsync();
        }

        public async Task<Message> GetLastMessageAsync(int chatId)
        {
            return await _context.Messages
                .Include(m => m.ChatParticipant)
                .Where(m => m.ChatParticipant.ChatId == chatId)
                .OrderByDescending(m => m.Timestamp)
                .FirstOrDefaultAsync();
        }
    }
}