using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Infrastructure.Data;
using PureConnectBackend.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Services
{
    public class FollowService : IFollowService
    {
        /// <summary>
        /// Entity Framework DbContext.
        /// </summary>
        private readonly ApplicationContext _context;

        public FollowService(ApplicationContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Adds new follow.
        /// </summary>
        /// <param name="request">Follower`s and followe`s id with follow date.</param>
        /// <returns>Status code of the operation.</returns>
        public async Task<HttpStatusCode> AddFollow(FollowAddRequest request, User user)
        {
            var follow = await _context.Follows.FirstOrDefaultAsync(x => x.FolloweeId == request.FolloweeId && x.FollowerId == user.Id);

            if(follow is not null)
                return HttpStatusCode.BadRequest;
            var newFollow = new Follow() { FolloweeId = request.FolloweeId, FollowerId = user.Id, RequestDate = request.RequestDate };
            return await AddFollowToDb(newFollow);
        }


        /// <summary>
        /// Deletes follow.
        /// </summary>
        /// <param name="request">Follower`s and followe`s id with follow date.</param>
        /// <returns>Status code of the operation.</returns>
        public async Task<HttpStatusCode> RemoveFollow(FollowDeleteRequest request, User user)
        {
            var follow = await _context.Follows.FirstOrDefaultAsync(x => x.FolloweeId == request.FolloweeId && x.FollowerId == user.Id);

            if (follow is null)
                return HttpStatusCode.BadRequest;
            return await DeleteFollowFromDb(follow);
        }

        /// <summary>
        /// Adds follow to db context.
        /// </summary>
        /// <param name="follow">Follow object to add.</param>
        /// <returns>Status code 201.</returns>
        private async Task<HttpStatusCode> AddFollowToDb(Follow follow)
        {
            _context.Follows.Add(follow);
            await _context.SaveChangesAsync();
            return HttpStatusCode.Created;
        }

        /// <summary>
        /// Deletes follow from db.
        /// </summary>
        /// <param name="follow">Follow object to delete.</param>
        /// <returns>Status code 201.</returns>
        private async Task<HttpStatusCode> DeleteFollowFromDb(Follow follow)
        {
            _context.Follows.Remove(follow);
            await _context.SaveChangesAsync();
            return HttpStatusCode.Created;
        }
    }
}
