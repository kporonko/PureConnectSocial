﻿using PureConnectBackend.Core.Models.Models;
using PureConnectBackend.Core.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Interfaces
{
    public interface IFollowService
    {
        Task<HttpStatusCode> AddFollow(FollowAddRequest request, User user);
        Task<HttpStatusCode> RemoveFollow(FollowDeleteRequest request, User user);
        Task<HttpStatusCode> RemoveFollowByPostId(DeletePostRequest request, User user);
    }
}
