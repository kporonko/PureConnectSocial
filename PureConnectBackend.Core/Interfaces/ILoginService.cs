using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Interfaces
{
    public interface ILoginService
    {
        public User? GetUser(UserLogin userLogin);
    }
}
