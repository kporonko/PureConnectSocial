using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PureConnectBackend.Core.Extentions;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Models;

namespace PureConnectBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoogleAuthController : ControllerBase
    {
        private IConfiguration _config;
        private IGoogleAuthService _googleService;
        public GoogleAuthController(IConfiguration config, IGoogleAuthService googleService )
        {
            _config = config;
            _googleService = googleService;
        }

        [HttpPost("auth")]
        public async Task<ActionResult<UserLoginResponse>> AuthUserWithGoogle([FromBody] AuthUserWithGoogleRequest googleAuthRequest)
        {
            User? user = await _googleService.AuthUserWithGoogle(googleAuthRequest.Token);
            var tokenResponse = UserExtentions.GenerateTokenFromUser(user, _config["Jwt:Key"], _config["Jwt:Issuer"], _config["Jwt:Audience"]);
            UserLoginResponse userLoginResponse = new UserLoginResponse() { Token = tokenResponse };
            return Ok(userLoginResponse);
        }
    }
}
