using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Requests;

namespace PureConnectBackend.Core.Hubs
{
    public class ChatHub : Hub<IChatHub>
    {
        private readonly ILogger<ChatHub> _logger;

        public ChatHub(ILogger<ChatHub> logger)
        {
            _logger = logger;
        }

        public async Task SendMessage(int chatId, MessageSignalRModel message)
        {
            _logger.LogInformation($"Client calling SendMessage for chat {chatId}: {message.MessageText}");

            var userIdStr = Context.UserIdentifier;
            if (string.IsNullOrEmpty(userIdStr))
            {
                _logger.LogError("UserIdentifier is null or empty");
                return;
            }

            if (!int.TryParse(userIdStr, out int userId))
            {
                _logger.LogError($"Could not parse user ID: {userIdStr}");
                return;
            }

            _logger.LogInformation($"User {userId} sending message to chat {chatId}");
            await Clients.Group(chatId.ToString()).SendMessage(chatId, message);
            _logger.LogInformation($"Message sent to group {chatId}");
        }

        public async Task JoinChat(int chatId)
        {
            _logger.LogInformation($"User joining chat {chatId}, ConnectionId: {Context.ConnectionId}");
            await Groups.AddToGroupAsync(Context.ConnectionId, chatId.ToString());
            _logger.LogInformation($"User joined chat {chatId}, ConnectionId: {Context.ConnectionId}");
        }

        public async Task LeaveChat(int chatId)
        {
            _logger.LogInformation($"User leaving chat {chatId}, ConnectionId: {Context.ConnectionId}");
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatId.ToString());
            _logger.LogInformation($"User left chat {chatId}, ConnectionId: {Context.ConnectionId}");
        }

        public async Task OnUserJoined(int chatId, int userId)
        {
            _logger.LogInformation($"OnUserJoined called for chat {chatId}, user {userId}");
            await Groups.AddToGroupAsync(Context.ConnectionId, chatId.ToString());
            await Clients.Group(chatId.ToString()).OnUserJoined(chatId, userId);
            _logger.LogInformation($"OnUserJoined event sent to group {chatId}");
        }

        public override async Task OnConnectedAsync()
        {
            _logger.LogInformation($"Client connected: {Context.ConnectionId}, User: {Context.UserIdentifier}");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            _logger.LogInformation($"Client disconnected: {Context.ConnectionId}, User: {Context.UserIdentifier}, Exception: {exception?.Message}");
            await base.OnDisconnectedAsync(exception);
        }
    }
}