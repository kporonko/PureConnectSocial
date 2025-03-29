using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Data;
using PureConnectBackend.Infrastructure.Enums;
using PureConnectBackend.Infrastructure.Models;

namespace PureConnectBackend.Core.Services
{
    public class ChatService : IChatService
    {
        private readonly ApplicationContext _context;

        public ChatService(ApplicationContext context)
        {
            _context = context;
        }

        public async Task<Chat> CreateChatAsync(string name, ChatType type, int creatorId)
        {
            var chat = new Chat
            {
                Name = name,
                ChatType = type
            };

            _context.Chats.Add(chat);
            await _context.SaveChangesAsync();

            var chatParticipant = new ChatParticipant
            {
                ChatId = chat.Id,
                UserId = creatorId,
                JoinedAt = DateTime.UtcNow
            };

            chat.ChatParticipants.Add(chatParticipant);
            await _context.SaveChangesAsync();
            return chat;
        }

        public async Task<MessageResponse> SendMessageAsync(int chatId, int senderId, string content)
        {
            var chatParticipant = await _context.ChatParticipants
                .FirstOrDefaultAsync(cp => cp.ChatId == chatId && cp.UserId == senderId);

            if (chatParticipant == null)
                throw new InvalidOperationException("User is not a participant of this chat");

            var message = new Message
            {
                Content = content,
                Timestamp = DateTime.UtcNow,
                ChatParticipantId = chatParticipant.Id
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return new MessageResponse 
            {
                MessageId = message.Id,
                MessageText = message.Content,
                SenderId = senderId
            };
        }
        
        public async Task<ChatResponse> GetChatHistoryAsync(int chatId, int userId)
        {
            var chat = await GetChatWithParticipantsAsync(chatId);
            if (chat == null)
                return null;

            var messages = await GetChatMessagesAsync(chatId);
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
            var chats = await _context.Chats
                .Include(c => c.ChatParticipants)
                    .ThenInclude(x => x.User)
                .Where(c => c.ChatParticipants.Any(cp => cp.UserId == userId))
                .ToListAsync();

            var chatResponse = new ChatShortResponse();

            foreach (var chat in chats)
            {
                var lastMessage = await _context.Messages
                    .Include(m => m.ChatParticipant)
                    .Where(m => m.ChatParticipant.ChatId == chat.Id)
                    .OrderByDescending(m => m.Timestamp)
                    .FirstOrDefaultAsync();

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

                chatResponse = new ChatShortResponse
                {
                    Chats = new List<ChatShort> { chatShort }
                };
            }

            return chatResponse;
        }

        public async Task<bool> AddParticipantAsync(int chatId, int userId)
        {
            var existingParticipant = await _context.ChatParticipants
                .FirstOrDefaultAsync(cp => cp.ChatId == chatId && cp.UserId == userId);

            if (existingParticipant != null)
                return false;

            var chatParticipant = new ChatParticipant
            {
                ChatId = chatId,
                UserId = userId,
                JoinedAt = DateTime.UtcNow
            };

            _context.ChatParticipants.Add(chatParticipant);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveParticipantAsync(int chatId, int userId)
        {
            var chatParticipant = await _context.ChatParticipants
                .FirstOrDefaultAsync(cp => cp.ChatId == chatId && cp.UserId == userId);

            if (chatParticipant == null)
                return false;

            _context.ChatParticipants.Remove(chatParticipant);
            await _context.SaveChangesAsync();
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

            // ��� ���������� ���� ���� ���������� null
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
        
        private async Task<Chat> GetChatWithParticipantsAsync(int chatId)
        {
            return await _context.Chats
                .Include(c => c.ChatParticipants)
                    .ThenInclude(cp => cp.User)
                .FirstOrDefaultAsync(c => c.Id == chatId);
        }

        private async Task<List<Message>> GetChatMessagesAsync(int chatId)
        {
            return await _context.Messages
                .Include(m => m.ChatParticipant)
                    .ThenInclude(cp => cp.User)
                .Where(m => m.ChatParticipant.ChatId == chatId)
                .OrderBy(m => m.Timestamp)
                .ToListAsync();
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