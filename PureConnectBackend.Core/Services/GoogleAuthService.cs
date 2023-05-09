﻿using Azure.Core;
using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Extentions;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models;
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
        /// If user`s email is already registered - gets user data, otherwise creates new user, adds to db and returns him.
        /// </summary>
        /// <param name="token">JWT token string with user`s data.</param>
        /// <returns>User with this email or new created user.</returns>
        public async Task<User?> AuthUserWithGoogle(string token)
        {
            TokenCredentials tokenCredentials = token.GetCredentialsFromToken();

            User? user = await _context.Users.FirstOrDefaultAsync(x => x.Email == tokenCredentials.Email);
            if (user is null)
                await RegisterUserGoogle(tokenCredentials);

            var userResponse = await LoginUserGoogle(tokenCredentials);

            return userResponse;
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
