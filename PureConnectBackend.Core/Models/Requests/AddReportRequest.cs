using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Models.Requests
{
    public class AddReportRequest
    {
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
