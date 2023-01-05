using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PureConnectBackend.Core.Extentions;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Models;
using System.Text;

namespace PureConnectBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private IConfiguration _config;
        private ILoginService _loginService;
        private readonly IStringLocalizer<LoginController> _stringLocalizer;
        public LoginController(IConfiguration config, ILoginService loginService, IStringLocalizer<LoginController> stringLocalizer)
        {
            _config = config;
            _loginService = loginService;
            _stringLocalizer = stringLocalizer;
        }

        /// <summary>
        /// Login endpoint.
        /// </summary>
        /// <param name="userLogin">User login data.</param>
        /// <returns>Response with status code 200 and dto with jwt token in it, or 404 error if data was invalid for that user.</returns>
        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<UserLoginResponse>> Login([FromBody] LoginUserRequest userLogin)
        {
            var user = await Authenticate(userLogin);

            if (user is not null)
            {
                var token = UserExtentions.GenerateTokenFromUser(user, _config["Jwt:Key"], _config["Jwt:Issuer"], _config["Jwt:Audience"]);
                UserLoginResponse userLoginResponse = new UserLoginResponse() { Token = token, Role = user.Role };
                return Ok(userLoginResponse);
            }

            return NotFound(_stringLocalizer.GetString("UserNotFound"));
        }

        /// <summary>
        /// Method that tries to login user data.
        /// </summary>
        /// <param name="userLogin">User login data.</param>
        /// <returns>If data is valid returns User object, otherwise null.</returns>
        private async Task<User?> Authenticate(LoginUserRequest userLogin)
        {
            User? currUser = await _loginService.GetUser(userLogin);
            return currUser;
        }
    }
}
