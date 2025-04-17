using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Models;

namespace PureConnectBackend.Core.Interfaces
{
    public interface IChatHub
    {
        // �������� ��������� ������ ���������� ������ ���������, � �� ������ �������
        Task SendMessage(int chatId, MessageSignalRModel message);

        // ����������� � ������������� ������������
        Task OnUserJoined(int chatId, int userId);

        // ����� �������� ����� ��� ���������� ������ �����
        Task UpdateChatList();
    }
}