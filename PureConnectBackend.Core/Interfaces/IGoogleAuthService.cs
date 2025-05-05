using PureConnectBackend.Core.Models.Models;

namespace PureConnectBackend.Core.Interfaces
{
    public interface IGoogleAuthService
    {
        public Task<User?> AuthUserWithGoogle(string token);
    }
}
