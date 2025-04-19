using PureConnectBackend.Core.Extentions;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Repositories;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Services
{
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly IUserRepository _userRepository;

        public GoogleAuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        /// <summary>
        /// If user`s email is already registered - gets user data, otherwise creates new user, adds to db and returns him.
        /// </summary>
        /// <param name="token">JWT token string with user`s data.</param>
        /// <returns>User with this email or new created user.</returns>
        public async Task<User> AuthUserWithGoogle(string token)
        {
            TokenCredentials tokenCredentials = token.GetCredentialsFromToken();

            User user = await _userRepository.GetUserByEmailAsync(tokenCredentials.Email);

            if (user is null)
            {
                user = ConvertTokenCredentialsIntoUser(tokenCredentials);
                await _userRepository.AddAsync(user);
                await _userRepository.SaveChangesAsync();
            }

            return user;
        }

        /// <summary>
        /// Converts TokenCredentials model into User model.
        /// </summary>
        /// <param name="tokenCredentials">Token user`s data.</param>
        /// <returns>User object ready to be added to db.</returns>
        private User ConvertTokenCredentialsIntoUser(TokenCredentials tokenCredentials)
        {
            return new User
            {
                Email = tokenCredentials.Email,
                Avatar = tokenCredentials.Picture,
                FirstName = tokenCredentials.FirstName,
                LastName = tokenCredentials.LastName,
                UserName = tokenCredentials.Name,
                IsOpenAcc = true,
                Role = "user"
            };
        }
    }
}