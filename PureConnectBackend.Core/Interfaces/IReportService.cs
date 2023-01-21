using PureConnectBackend.Core.Models.Requests;
using PureConnectBackend.Infrastructure.Models;
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
        Task<HttpStatusCode> AddReport(User currUser, AddReportRequest report);
        Task<HttpStatusCode> AddPostReport(User currUser, AddPostReportRequest postReport);
    }
}
