using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Extentions;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Infrastructure.Data;
using PureConnectBackend.Infrastructure.Models;
using System.Net;

namespace PureConnectBackend.Core.Services
{
    public class RegisterService : IRegisterService
    {
        /// <summary>
        /// Entity Framework DbContext.
        /// </summary>
        private readonly ApplicationContext _context;

        public RegisterService(ApplicationContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Creates new user from entered data (if email isnt taken).
        /// </summary>
        /// <param name="registerUser">User`s registration data.</param>
        /// <returns>201 if account was created. 409 if email is already taken.</returns>
        public async Task<HttpStatusCode> RegisterUser(RegisterUserRequest registerUser)
        {
            var isEmailExists = await IsEmailExists(registerUser.Email);
            if (isEmailExists)
                return HttpStatusCode.Conflict;
            User user = ConvertRegisterToUser(registerUser);
            await AddUserToDb(user);
            return HttpStatusCode.Created;
        }


        /// <summary>
        /// Checks whether the email is already taken.
        /// </summary>
        /// <param name="profileRegister">Register user data.</param>
        /// <returns>Whether login already exists or not.</returns>
        private async Task<bool> IsEmailExists(string email)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(x => x.Email ==  email);
            return user != null;
        }

        /// <summary>
        /// Converts RegisterUserRequest dto object to User object.
        /// </summary>
        /// <param name="registerUser">User`s register data.</param>
        /// <returns>User object.</returns>
        private User ConvertRegisterToUser(RegisterUserRequest registerUser)
        {
            User user = new User { 
                Email= registerUser.Email,
                UserName = registerUser.UserName,
                FirstName = registerUser.FirstName,
                LastName = registerUser.LastName,
                Role = "user",
                Location = registerUser.Location,
                Avatar = registerUser.Avatar,
                BirthDate = registerUser.BirthDate,
                IsOpenAcc = true };

            user.Password = registerUser.Password.ConvertPasswordToHash();
            return user;
        }

        /// <summary>
        /// Adds the user to database.
        /// </summary>
        /// <param name="user">User to add.</param>
        private async Task AddUserToDb(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
    }
}
