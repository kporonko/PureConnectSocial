﻿using PureConnectBackend.Core.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Models
{
    public class SearchedUserResponse : RecommendedUserResponse
    {
        public string Username { get; set; }
    }
}
