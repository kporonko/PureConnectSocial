using PureConnectBackend.Core.Extentions;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Repositories;
using System.Net;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Services
{
    public class RegisterService : IRegisterService
    {
        private readonly IUserRepository _userRepository;

        public RegisterService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        /// <summary>
        /// Creates new user from entered data (if email isn't taken).
        /// </summary>
        /// <param name="registerUser">User's registration data.</param>
        /// <returns>201 if account was created. 409 if email is already taken.</returns>
        public async Task<HttpStatusCode> RegisterUser(RegisterUserRequest registerUser)
        {
            // Проверяем, существует ли пользователь с таким email
            var existingUser = await _userRepository.GetUserByEmailAsync(registerUser.Email);
            if (existingUser != null)
                return HttpStatusCode.Conflict;

            // Создаем нового пользователя
            var user = new User
            {
                Email = registerUser.Email,
                UserName = registerUser.UserName,
                FirstName = registerUser.FirstName,
                LastName = registerUser.LastName,
                Role = "user",
                Location = registerUser.Location,
                Avatar = registerUser.Avatar,
                BirthDate = registerUser.BirthDate,
                IsOpenAcc = true,
                Password = registerUser.Password.ConvertPasswordToHash()
            };

            // Добавляем пользователя в базу данных
            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            return HttpStatusCode.Created;
        }
    }
}