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

        // Override Equals method
        public override bool Equals(object? obj)
        {
            if (obj is PostImageResponse other)
            {
                return this.PostId == other.PostId;
            }
            return false;
        }

        // Override GetHashCode to work with Distinct()
        public override int GetHashCode()
        {
            return PostId.GetHashCode();
        }
    }
}
