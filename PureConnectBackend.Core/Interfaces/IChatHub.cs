using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Models;

namespace PureConnectBackend.Core.Interfaces
{
    public interface IChatHub
    {
        // ќтправка сообщени€ должна передавать полное сообщение, а не только контент
        Task SendMessage(int chatId, MessageSignalRModel message);

        // ”ведомление о присоединении пользовател€
        Task OnUserJoined(int chatId, int userId);

        // ћожно добавить метод дл€ обновлени€ списка чатов
        Task UpdateChatList();
    }
}