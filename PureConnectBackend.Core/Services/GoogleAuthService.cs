using Azure.Core;
using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Data;
using PureConnectBackend.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Services
{
    public class GoogleAuthService : IGoogleAuthService
    {
        /// <summary>
        /// Entity Framework DbContext.
        /// </summary>
        private readonly ApplicationContext _context;

        public GoogleAuthService(ApplicationContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Private class to store google token credentials.
        /// </summary>
        private class TokenCredentials
        {
            public string Email { get; set; }
            public string Name { get; set; }
            public string Picture { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
        }


        /// <summary>
        /// If user`s email is already registered - gets user data, otherwise creates new user, adds to db and returns him.
        /// </summary>
        /// <param name="token">JWT token string with user`s data.</param>
        /// <returns>User with this email or new created user.</returns>
        public async Task<User?> AuthUserWithGoogle(string token)
        {
            TokenCredentials tokenCredentials = GetCredentialsFromToken(token);

            User? user = await _context.Users.FirstOrDefaultAsync(x => x.Email == tokenCredentials.Email);
            if (user is null)
                await RegisterUserGoogle(tokenCredentials);

            var userResponse = await LoginUserGoogle(tokenCredentials);

            return userResponse;
        }


        /// <summary>
        /// Decodes JWT token into user info.
        /// </summary>
        /// <param name="token">JWt token string.</param>
        /// <returns>Token user info.</returns>
        private TokenCredentials GetCredentialsFromToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token);
            var tokenS = jsonToken as JwtSecurityToken;

            TokenCredentials res = new TokenCredentials();
            res.Email =  tokenS.Claims.First(claim => claim.Type == "email").Value;
            res.Name = tokenS.Claims.First(claim => claim.Type == "name").Value;
            res.Picture = tokenS.Claims.First(claim => claim.Type == "picture").Value;
            res.FirstName = tokenS.Claims.First(claim => claim.Type == "given_name").Value;
            res.LastName = tokenS.Claims.First(claim => claim.Type == "family_name").Value;

            return res;
        }

        /// <summary>
        /// Creates new account of user.
        /// </summary>
        /// <param name="tokenCredentials">Token credentials model with user`s data.</param>
        private async Task RegisterUserGoogle(TokenCredentials tokenCredentials)
        {
            var user = ConvertTokenCredentialsIntoUser(tokenCredentials);
            await AddUserToDb(user);
        }

        /// <summary>
        /// Gets for user with given email.
        /// </summary>
        /// <param name="tokenCredentials">Token credentials model with user`s data.</param>
        /// <returns>User with given in token email.</returns>
        private async Task<User?> LoginUserGoogle(TokenCredentials tokenCredentials)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(x => x.Email == tokenCredentials.Email);
            return user;
        }


        /// <summary>
        /// Converts TokenCredentials model into User model.
        /// </summary>
        /// <param name="tokenCredentials">Token user`s data.</param>
        /// <returns>User object ready to be added to db.</returns>
        private User ConvertTokenCredentialsIntoUser(TokenCredentials tokenCredentials)
        {
            User user = new User();
            user.Email = tokenCredentials.Email;
            user.Avatar = tokenCredentials.Picture;
            user.FirstName = tokenCredentials.FirstName;
            user.LastName = tokenCredentials.LastName;
            user.UserName = tokenCredentials.Name;

            user.IsOpenAcc = true;
            user.Role = "user";
            return user;
        }

        /// <summary>
        /// Adds user to db context.
        /// </summary>
        /// <param name="user">User to add.</param>
        private async Task AddUserToDb(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }
    }
}
