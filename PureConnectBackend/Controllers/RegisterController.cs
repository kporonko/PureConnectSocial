using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
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
        private readonly IStringLocalizer<LoginController> _stringLocalizer;

        public RegisterController(IConfiguration config, IRegisterService userService, IStringLocalizer<LoginController> stringLocalizer)
        {
            _config = config;
            _userService = userService;
            _stringLocalizer = stringLocalizer;
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
                return Conflict(_stringLocalizer.GetString("EmailUsed"));

            return Ok(_stringLocalizer.GetString("AccountCreated"));
        }
    }
}
