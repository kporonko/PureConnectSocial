using Microsoft.AspNetCore.SignalR;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Infrastructure.Models;

namespace PureConnectBackend.Core.Hubs
{
    public class ChatHub : Hub<IChatHub>
    {
        public async Task SendMessage(int chatId, string content)
        {
            var userIdStr = Context.UserIdentifier;
            if (string.IsNullOrEmpty(userIdStr))
                return;

            if (!int.TryParse(userIdStr, out int userId))
                return;

            await Clients.Group(chatId.ToString()).SendMessage(chatId, content);
        }
        
        public async Task OnUserJoined(int chatId, int userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, chatId.ToString());
            await Clients.Group(chatId.ToString()).OnUserJoined(chatId, userId);
        }
    }
} 