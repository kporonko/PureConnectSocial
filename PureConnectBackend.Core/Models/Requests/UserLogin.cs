﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Models.Requests
{
    public class UserLogin
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
