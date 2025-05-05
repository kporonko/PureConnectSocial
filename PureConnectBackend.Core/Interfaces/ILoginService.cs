using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Requests;

namespace PureConnectBackend.Core.Interfaces
{
    public interface ILoginService
    {
        public Task<User?> GetUser(LoginUserRequest userLogin);
    }
}
