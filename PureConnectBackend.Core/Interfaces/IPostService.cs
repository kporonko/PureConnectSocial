﻿using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Core.Models.Responses;
using PureConnectBackend.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Interfaces
{
    public interface IPostService
    {
        Task<HttpStatusCode> CreatePost(CreatePostRequest postInfo, User userFromJwt);
        Task<HttpStatusCode> DeletePost(DeletePostRequest postInfo);
        Task<HttpStatusCode> EditPost(EditPostInfoRequest postNewInfo);
        Task<PostResponse?> GetPost(User userFromJwt, int postId);
        Task<List<PostImageResponse>?> GetPostsImages(User userFromJwt);
        Task<List<PostResponse>?> GetPosts(User userFromJwt);
        Task<List<PostResponse>?> GetRecommendedPosts(User userFromJwt);


        Task<HttpStatusCode> LikePost(LikePostRequest likeInfo, User userFromJwt);
        Task<HttpStatusCode> UnlikePost(LikePostDeleteRequest likeInfo, User userFromJwt);

        Task<List<UserLikedPost>> GetUsersLikedPost(User userFromJwt, int postId);
    }
}
