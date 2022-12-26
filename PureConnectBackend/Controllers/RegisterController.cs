using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Core.Services;

namespace PureConnectBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private IConfiguration _config;
        private IRegisterService _userService;
        public RegisterController(IConfiguration config, IRegisterService userService)
        {
            _config = config;
            _userService = userService;
        }

        /// <summary>
        /// Register endpoint.
        /// </summary>
        /// <param name="userRegister"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Register([FromBody] RegisterUserRequest userRegister)
        {
            var codeResult = _userService.RegisterUser(userRegister);
            if((int)codeResult == 409)
                return Conflict("This email is already in use.");

            return Ok("Account successfully cresated.");
        }
    }
}
