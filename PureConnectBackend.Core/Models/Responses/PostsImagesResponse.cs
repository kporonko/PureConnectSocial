using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Models.Responses
{
    public class PostImageResponse
    {
        public int PostId { get; set; }
        public string? Image { get; set; }
    }
}
