using PureConnectBackend.Infrastructure.Models;

namespace PureConnectBackend.Core.Interfaces
{
    public interface IChatHub
    {
        Task SendMessage(int chatId, string message);
        Task OnUserJoined(int chatId, int userId);
    }
} 