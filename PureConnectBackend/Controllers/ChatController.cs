using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Localization;
using PureConnectBackend.Core.Extentions;
using PureConnectBackend.Core.Hubs;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using System.Security.Claims;

namespace PureConnectBackend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly IStringLocalizer<ChatController> _stringLocalizer;
        private readonly IHubContext<ChatHub, IChatHub> _chatHubContext;

        public ChatController(
            IChatService chatService,
            IStringLocalizer<ChatController> stringLocalizer,
            IHubContext<ChatHub, IChatHub> chatHubContext)
        {
            _chatService = chatService;
            _stringLocalizer = stringLocalizer;
            _chatHubContext = chatHubContext;
        }

        [HttpPost]
        [Authorize(Roles = "user")]
        public async Task<ActionResult<Chat>> CreateChat([FromBody] CreateChatDto dto)
        {
            var user = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
            if (user == null)
                return BadRequest(_stringLocalizer.GetString("UserNotFound"));

            // Создаем чат через сервис
            var chat = await _chatService.CreateChatAsync(dto.Name, dto.Type, user.Id);

            // Добавляем участников через сервис
            foreach (var participantId in dto.ParticipantsIds)
            {
                var result = await _chatService.AddParticipantAsync(chat.Id, participantId);
                if (!result)
                    return BadRequest(_stringLocalizer.GetString("FailedToAddParticipant"));

                // Уведомляем нового участника через SignalR
                await _chatHubContext.Clients.User(participantId.ToString()).OnUserJoined(chat.Id, participantId);
            }

            // Уведомляем создателя чата
            await _chatHubContext.Clients.User(user.Id.ToString()).OnUserJoined(chat.Id, user.Id);

            return Ok(chat);
        }

        [HttpPost("{chatId}/messages")]
        public async Task<ActionResult<MessageResponse>> SendMessage(int chatId, [FromBody] SendMessageDto dto)
        {
            Console.WriteLine($"SendMessage called for chat {chatId}, content: {dto.Content}");

            var user = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
            if (user == null)
            {
                Console.WriteLine("User not found");
                return BadRequest(_stringLocalizer.GetString("UserNotFound"));
            }

            Console.WriteLine($"User {user.Id} sending message to chat {chatId}");

            // Сохраняем сообщение через сервис
            var message = await _chatService.SendMessageAsync(chatId, user.Id, dto.Content);
            Console.WriteLine($"Message saved to database with ID {message.MessageId}");

            // Отправляем сообщение через SignalR
            var signalMessageModel = new MessageSignalRModel
            {
                MessageId = message.MessageId,
                SenderId = user.Id,
                MessageText = message.MessageText,
                MessageDate = message.Timestamp
            };

            Console.WriteLine($"Sending message to chat {chatId} via SignalR: {message.MessageText}");
            await _chatHubContext.Clients.Group(chatId.ToString()).SendMessage(chatId, signalMessageModel);
            Console.WriteLine($"Message sent to chat {chatId} via SignalR");

            return Ok(message);
        }

        [HttpGet]
        [Route("chats")]
        public async Task<ActionResult<IEnumerable<ChatShortResponse>>> GetUserChats()
        {
            var user = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
            if (user == null)
                return BadRequest(_stringLocalizer.GetString("UserNotFound"));

            var chats = await _chatService.GetUserChatsAsync(user.Id);
            return Ok(chats);
        }

        [HttpGet("{chatId}/messages")]
        public async Task<ActionResult<ChatResponse>> GetChatHistory(int chatId)
        {
            var user = UserExtentions.GetCurrentUser(HttpContext.User.Identity as ClaimsIdentity);
            if (user == null)
                return BadRequest(_stringLocalizer.GetString("UserNotFound"));

            var messages = await _chatService.GetChatHistoryAsync(chatId, user.Id);

            if (messages is null)
                return BadRequest(_stringLocalizer.GetString("ChatNotFound"));
            
            return Ok(messages);
        }

        [HttpPost("{chatId}/participants/{userId}")]
        public async Task<ActionResult> AddParticipant(int chatId, int userId)
        {
            var result = await _chatService.AddParticipantAsync(chatId, userId);
            if (!result)
                return BadRequest(_stringLocalizer.GetString("FailedToAddParticipant"));

            // Уведомляем нового участника о добавлении в чат
            await _chatHubContext.Clients.User(userId.ToString()).OnUserJoined(chatId, userId);

            // Уведомляем всех участников чата о новом участнике
            await _chatHubContext.Clients.Group(chatId.ToString()).OnUserJoined(chatId, userId);

            return Ok(_stringLocalizer.GetString("ParticipantAdded"));
        }
    }
}