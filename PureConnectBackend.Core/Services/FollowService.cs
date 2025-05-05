using PureConnectBackend.Core.Interfaces;
using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Repositories;
using System.Net;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Services
{
    public class FollowService : IFollowService
    {
        private readonly IFollowRepository _followRepository;
        private readonly IPostRepository _postRepository;

        public FollowService(IFollowRepository followRepository, IPostRepository postRepository)
        {
            _followRepository = followRepository;
            _postRepository = postRepository;
        }

        /// <summary>
        /// Adds new follow.
        /// </summary>
        /// <param name="request">Follower`s and followe`s id with follow date.</param>
        /// <param name="user">User object with data from jwt.</param>
        /// <returns>Status code of the operation.</returns>
        public async Task<HttpStatusCode> AddFollow(FollowAddRequest request, User user)
        {
            var follow = await _followRepository.GetFollowAsync(user.Id, request.FolloweeId);

            if (follow is not null)
                return HttpStatusCode.BadRequest;

            var newFollow = new Follow
            {
                FolloweeId = request.FolloweeId,
                FollowerId = user.Id,
                RequestDate = request.RequestDate
            };

            await _followRepository.AddAsync(newFollow);
            await _followRepository.SaveChangesAsync();
            return HttpStatusCode.Created;
        }

        /// <summary>
        /// Deletes follow.
        /// </summary>
        /// <param name="request">Follower`s and followe`s id with follow date.</param>
        /// <param name="user">User object with data from jwt.</param>
        /// <returns>Status code of the operation.</returns>
        public async Task<HttpStatusCode> RemoveFollow(FollowDeleteRequest request, User user)
        {
            var follow = await _followRepository.GetFollowAsync(user.Id, request.FolloweeId);

            if (follow is null)
                return HttpStatusCode.BadRequest;

            await _followRepository.DeleteAsync(follow);
            await _followRepository.SaveChangesAsync();
            return HttpStatusCode.Created;
        }

        /// <summary>
        /// Deletes follow from user by post id.
        /// </summary>
        /// <param name="request">DeletePostRequest object with post id.</param>
        /// <param name="user">User object with data from jwt.</param>
        /// <returns>200 if was deleted. 400 if smth went wrong.</returns>
        public async Task<HttpStatusCode> RemoveFollowByPostId(DeletePostRequest request, User user)
        {
            var post = await _postRepository.GetPostWithUserAsync(request.PostId);

            if (post is null)
                return HttpStatusCode.BadRequest;

            var follow = await _followRepository.GetFollowAsync(user.Id, post.User.Id);

            if (follow is null)
                return HttpStatusCode.BadRequest;

            await _followRepository.DeleteAsync(follow);
            await _followRepository.SaveChangesAsync();
            return HttpStatusCode.Created;
        }
    }
}