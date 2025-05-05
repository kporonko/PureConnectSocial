using Microsoft.AspNetCore.Mvc;
using PureConnectBackend.Core.Extentions;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;

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

        /// <summary>
        /// Authenticates user with google credentials by it`s token.
        /// </summary>
        /// <param name="googleAuthRequest">Token google request.</param>
        /// <returns>Token by user from db.</returns>
        [HttpPost("auth")]
        public async Task<ActionResult<UserLoginResponse>> AuthUserWithGoogle([FromBody] AuthUserWithGoogleRequest googleAuthRequest)
        {
            User? user = await _googleService.AuthUserWithGoogle(googleAuthRequest.Token);
            var tokenResponse = UserExtentions.GenerateTokenFromUser(user, _config["Jwt:Key"], _config["Jwt:Issuer"], _config["Jwt:Audience"]);
            UserLoginResponse userLoginResponse = new UserLoginResponse() { Token = tokenResponse, Role = user.Role };
            return Ok(userLoginResponse);
        }
    }
}
