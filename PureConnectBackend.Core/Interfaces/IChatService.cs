using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Enums;
using PureConnectBackend.Infrastructure.Models;

namespace PureConnectBackend.Core.Interfaces
{
    public interface IChatService
    {
        Task<Chat> CreateChatAsync(string name, ChatType type, int creatorId);
        Task<MessageResponse> SendMessageAsync(int chatId, int senderId, string content);
        Task<ChatResponse> GetChatHistoryAsync(int chatId, int userId);
        Task<ChatShortResponse> GetUserChatsAsync(int userId);
        Task<bool> AddParticipantAsync(int chatId, int userId);
        Task<bool> RemoveParticipantAsync(int chatId, int userId);
    }
} 