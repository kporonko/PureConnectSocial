using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Interfaces
{
    public interface IGoogleAuthService
    {
        public Task<User?> AuthUserWithGoogle(string token);
    }
}
