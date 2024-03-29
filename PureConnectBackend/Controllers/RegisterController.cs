﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Core.Services;
using System.Net;

namespace PureConnectBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private IConfiguration _config;
        private IRegisterService _userService;
        private readonly IStringLocalizer<RegisterController> _stringLocalizer;

        public RegisterController(IConfiguration config, IRegisterService userService, IStringLocalizer<RegisterController> stringLocalizer)
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
        public async Task<IActionResult> Register([FromBody] RegisterUserRequest userRegister)
        {
            var codeResult = await _userService.RegisterUser(userRegister);
            if(codeResult == HttpStatusCode.Conflict)
                return Conflict(_stringLocalizer.GetString("EmailUsed"));

            return Ok(_stringLocalizer.GetString("AccountCreated"));
        }
    }
}
