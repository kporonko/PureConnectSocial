using PureConnectBackend.Core.Extentions;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Repositories;

namespace PureConnectBackend.Core.Services
{
    public class LoginService : ILoginService
    {
        private readonly IUserRepository _userRepository;

        public LoginService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        /// <summary>
        /// Gets user with inputted email and password or returns null.
        /// </summary>
        /// <param name="userLogin">User`s login data.</param>
        /// <returns>If there is user with such an email and password returns user object, otherwise null.</returns>
        public async Task<User> GetUser(LoginUserRequest userLogin)
        {
            var passwordHash = userLogin.Password.ConvertPasswordToHash();
            return await _userRepository.GetUserByCredentialsAsync(userLogin.Email, passwordHash);
        }
    }
}