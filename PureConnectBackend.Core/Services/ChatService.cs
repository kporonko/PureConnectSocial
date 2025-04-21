using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PureConnectBackend.Core.Enums;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Core.Repositories;

namespace PureConnectBackend.Core.Services
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;
        private readonly IChatParticipantRepository _chatParticipantRepository;
        private readonly IMessageRepository _messageRepository;

        public ChatService(
            IChatRepository chatRepository,
            IChatParticipantRepository chatParticipantRepository,
            IMessageRepository messageRepository)
        {
            _chatRepository = chatRepository;
            _chatParticipantRepository = chatParticipantRepository;
            _messageRepository = messageRepository;
        }

        public async Task<Chat> CreateChatAsync(string name, ChatType type, int creatorId)
        {
            var chat = new Chat
            {
                Name = name,
                ChatType = type,
                ChatParticipants = new List<ChatParticipant>()
            };

            await _chatRepository.AddAsync(chat);
            await _chatRepository.SaveChangesAsync();

            var chatParticipant = new ChatParticipant
            {
                ChatId = chat.Id,
                UserId = creatorId,
                JoinedAt = DateTime.UtcNow
            };

            chat.ChatParticipants.Add(chatParticipant);
            await _chatRepository.SaveChangesAsync();

            return chat;
        }

        public async Task<MessageResponse> SendMessageAsync(int chatId, int senderId, string content)
        {
            var chatParticipant = await _chatParticipantRepository.GetParticipantAsync(chatId, senderId);

            if (chatParticipant == null)
                throw new InvalidOperationException("User is not a participant of this chat");

            var message = new Message
            {
                Content = content,
                Timestamp = DateTime.UtcNow,
                ChatParticipantId = chatParticipant.Id
            };

            await _messageRepository.AddAsync(message);
            await _messageRepository.SaveChangesAsync();

            return new MessageResponse
            {
                MessageId = message.Id,
                MessageText = message.Content,
                SenderId = senderId,
                Timestamp = message.Timestamp
            };
        }

        public async Task<ChatResponse> GetChatHistoryAsync(int chatId, int userId)
        {
            var chat = await _chatRepository.GetChatWithParticipantsAsync(chatId);
            if (chat == null)
                return null;

            var messages = await _messageRepository.GetChatMessagesAsync(chatId);
            var participants = GetParticipantsList(chat);
            var messageResponses = GetMessageResponses(messages);

            return new ChatResponse
            {
                ChatId = chat.Id,
                UserId = userId,
                Participants = participants,
                Messages = messageResponses
            };
        }

        public async Task<ChatShortResponse> GetUserChatsAsync(int userId)
        {
            var chats = await _chatRepository.GetUserChatsWithParticipantsAsync(userId);

            var chatResponse = new ChatShortResponse();
            chatResponse.Chats = new List<ChatShort>();

            foreach (var chat in chats)
            {
                var lastMessage = await _messageRepository.GetLastMessageAsync(chat.Id);

                var chatShort = new ChatShort
                {
                    ChatId = chat.Id,
                    ChatAvatar = GetChatAvatar(chat, userId),
                    Name = GetChatName(chat, userId),
                    Lastmessage = lastMessage != null ? new LastMessage
                    {
                        MessageId = lastMessage.Id,
                        MessageText = lastMessage.Content,
                        SenderUsername = lastMessage.ChatParticipant.User.UserName,
                        SendDate = lastMessage.Timestamp,
                    } : new LastMessage()
                };

                chatResponse.Chats.Add(chatShort);
            }

            return chatResponse;
        }

        public async Task<bool> AddParticipantAsync(int chatId, int userId)
        {
            bool exists = await _chatParticipantRepository.IsParticipantAsync(chatId, userId);
            if (exists)
                return false;

            var chatParticipant = new ChatParticipant
            {
                ChatId = chatId,
                UserId = userId,
                JoinedAt = DateTime.UtcNow
            };

            await _chatParticipantRepository.AddAsync(chatParticipant);
            await _chatParticipantRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveParticipantAsync(int chatId, int userId)
        {
            var chatParticipant = await _chatParticipantRepository.GetParticipantAsync(chatId, userId);
            if (chatParticipant == null)
                return false;

            await _chatParticipantRepository.DeleteAsync(chatParticipant);
            await _chatParticipantRepository.SaveChangesAsync();
            return true;
        }

        private string GetChatAvatar(Chat chat, int currentUserId)
        {
            if (chat.ChatType == ChatType.Direct)
            {
                var otherParticipant = chat.ChatParticipants
                    .FirstOrDefault(cp => cp.UserId != currentUserId);

                return otherParticipant?.User?.Avatar ?? string.Empty;
            }

            return null;
        }

        private string GetChatName(Chat chat, int currentUserId)
        {
            if (chat.ChatType == ChatType.Direct)
            {
                var otherParticipant = chat.ChatParticipants
                    .FirstOrDefault(cp => cp.UserId != currentUserId);

                return otherParticipant?.User?.UserName ?? string.Empty;
            }

            return chat.Name;
        }

        private List<Participant> GetParticipantsList(Chat chat)
        {
            return chat.ChatParticipants
                .Select(cp => new Participant
                {
                    ParticipantId = cp.UserId,
                    Avatar = cp.User.Avatar,
                    FullName = $"{cp.User.FirstName} {cp.User.LastName}",
                    Username = cp.User.UserName,
                    Email = cp.User.Email
                })
                .ToList();
        }

        private List<MessageInChatResponse> GetMessageResponses(List<Message> messages)
        {
            return messages
                .Select(m => new MessageInChatResponse
                {
                    MessageId = m.Id,
                    MessageText = m.Content,
                    MessageDate = m.Timestamp.ToString("yyyy-MM-dd HH:mm:ss"),
                    SenderId = m.ChatParticipant.UserId.ToString(),
                    Email = m.ChatParticipant.User.Email
                })
                .ToList();
        }
    }
}