using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Infrastructure.Data;
using PureConnectBackend.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Services
{
    public class LoginService : ILoginService
    {
        /// <summary>
        /// Entity Framework DbContext.
        /// </summary>
        private readonly ApplicationContext _context;

        public LoginService(ApplicationContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets user with inputted email and password or returns null.
        /// </summary>
        /// <param name="userLogin">User`s login data.</param>
        /// <returns>If there is user with such an email and password returns user object, otherwise null.</returns>
        public User? GetUser(UserLogin userLogin)
        {
            User? user = _context.Users.FirstOrDefault(x => x.Email == userLogin.Email && x.Password == userLogin.Password);
            return user;
        }
    }
}
