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
        private readonly ApplicationContext _context;

        public LoginService(ApplicationContext context)
        {
            _context = context;
        }

        public User? GetUser(UserLogin userLogin)
        {
            User? user = _context.Users.FirstOrDefault(x => x.Email == userLogin.Email && x.Password == userLogin.Password);
            return user;
        }
    }
}
