using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace PureConnectBackend.Core.Hubs
{
    public class NotificationHub : Hub
    {
        // Hub method to send a notification to connected clients
        public async Task SendNotification(string notification)
        {
            await Clients.All.SendAsync("ReceiveNotification", notification);
        }

        // You can define other hub methods as needed

        // ...
    }
}
