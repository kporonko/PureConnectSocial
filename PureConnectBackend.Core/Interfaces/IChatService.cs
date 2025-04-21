using PureConnectBackend.Core.Enums;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Responses;

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