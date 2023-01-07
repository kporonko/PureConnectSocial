using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Models
{
    /// <summary>
    /// Private class to store google token credentials.
    /// </summary>
    public class TokenCredentials
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Picture { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
