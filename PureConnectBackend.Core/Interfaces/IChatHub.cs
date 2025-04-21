using PureConnectBackend.Core.Models.Requests;

namespace PureConnectBackend.Core.Interfaces
{
    public interface IChatHub
    {
        Task SendMessage(int chatId, MessageSignalRModel message);

        Task OnUserJoined(int chatId, int userId);

        Task UpdateChatList();
    }
}