using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Models.Requests
{
    public class EditPostInfoRequest
    {
        public int PostId { get; set; }
        public string Description { get; set; }
    }
}
