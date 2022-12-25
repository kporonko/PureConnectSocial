using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PureConnectBackend.Infrastructure.Models;
using System.Security.Claims;

namespace PureConnectBackend.Controllers
{
    /// <summary>
    /// Test controller.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet("Admins")]
        [Authorize(Roles = "user")]
        public IActionResult AdminsEndpoint()
        {
            var currUser = GetCurrentUser();

            return Ok($"Hi, {currUser.FirstName}, you are an {currUser.Role}, your id is: {currUser.Id}");
        }


        [HttpGet("public")]
        public IActionResult Public()
        {
            return Ok("Ok");
        }

        private User GetCurrentUser()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity is not null)
            {
                var userClaims = identity.Claims;

                return new User
                {
                    UserName = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)?.Value,
                    Email = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Email)?.Value,
                    FirstName = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.GivenName)?.Value,
                    LastName = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Surname)?.Value,
                    Role = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Role)?.Value,
                    Id = Convert.ToInt32(userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Sid)?.Value)

                };
            }
            return null;
        }
    }
}
