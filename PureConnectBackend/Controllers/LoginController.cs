using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Microsoft.IdentityModel.Tokens;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PureConnectBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private IConfiguration _config;
        private ILoginService _userService;
        private readonly IStringLocalizer<LoginController> _stringLocalizer;
        public LoginController(IConfiguration config, ILoginService userService, IStringLocalizer<LoginController> stringLocalizer)
        {
            _config = config;
            _userService = userService;
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
        public ActionResult<UserLoginResponse> Login([FromBody] LoginUserRequest userLogin)
        {
            var user = Authenticate(userLogin);

            if (user is not null)
            {
                var token = GenerateToken(user);
                UserLoginResponse userLoginResponse = new UserLoginResponse() { Token = token };
                return Ok(userLoginResponse);
            }

            return NotFound(_stringLocalizer.GetString("UserNotFound"));
        }

        /// <summary>
        /// Method generates a jwt token depending on user data.
        /// </summary>
        /// <param name="user">User who wants to receive token.</param>
        /// <returns>Jwt token string.</returns>
        private string GenerateToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.GivenName, user.FirstName),
                new Claim(ClaimTypes.Surname, user.LastName),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Sid, user.Id.ToString())
            };

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        /// Method that tries to login user data.
        /// </summary>
        /// <param name="userLogin">User login data.</param>
        /// <returns>If data is valid returns User object, otherwise null.</returns>
        private User? Authenticate(LoginUserRequest userLogin)
        {
            User? currUser = _userService.GetUser(userLogin);
            return currUser;
        }
    }
}
