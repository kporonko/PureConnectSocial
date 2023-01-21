using PureConnectBackend.Core.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Core.Interfaces
{
    public interface IReportService
    {
        Task<HttpStatusCode> AddReport(AddReportRequest report);
        Task<HttpStatusCode> AddPostReport(AddPostReportRequest postReport);
    }
}
