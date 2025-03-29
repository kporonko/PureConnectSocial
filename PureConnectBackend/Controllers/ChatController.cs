using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Infrastructure.Models;
using System.Security.Claims;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Core.Models.Requests;
using Microsoft.AspNetCore.SignalR;
using PureConnectBackend.Core.Hubs;

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
            var user = GetCurrentUser();
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
            var user = GetCurrentUser();
            if (user == null)
                return BadRequest(_stringLocalizer.GetString("UserNotFound"));

            // Сохраняем сообщение через сервис
            var message = await _chatService.SendMessageAsync(chatId, user.Id, dto.Content);

            // Отправляем сообщение через SignalR
            await _chatHubContext.Clients.Group(chatId.ToString()).SendMessage(chatId, message.MessageText);

            return Ok(message);
        }

        [HttpGet]
        [Route("chats")]
        public async Task<ActionResult<IEnumerable<ChatShortResponse>>> GetUserChats()
        {
            var user = GetCurrentUser();
            if (user == null)
                return BadRequest(_stringLocalizer.GetString("UserNotFound"));

            var chats = await _chatService.GetUserChatsAsync(user.Id);
            return Ok(chats);
        }

        [HttpGet("{chatId}/messages")]
        public async Task<ActionResult<ChatResponse>> GetChatHistory(int chatId)
        {
            var user = GetCurrentUser();
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

        /// <summary>
        /// Gets current user by authorizing jwt token.
        /// </summary>
        /// <returns></returns>
        private User? GetCurrentUser()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity is not null)
            {
                var userClaims = identity.Claims;

                return new User
                {
                    UserName = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)?.Value,
                    Email = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Email)?.Value,
                    FirstName = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.GivenName)?.Value,
                    LastName = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Surname)?.Value,
                    Role = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Role)?.Value,
                    Id = Convert.ToInt32(userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Sid)?.Value)
                };
            }
            return null;
        }
    }
}