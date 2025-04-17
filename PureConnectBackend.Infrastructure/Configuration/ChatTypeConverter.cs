using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PureConnectBackend.Infrastructure.Enums;
using PureConnectBackend.Infrastructure.Models;
using System;
using System.Linq.Expressions;

namespace PureConnectBackend.Infrastructure.Configuration
{
    public class ChatTypeConverter : ValueConverter<ChatType, string>
    {
        public ChatTypeConverter() : base(
            v => v.ToString(),
            v => (ChatType)Enum.Parse(typeof(ChatType), v))
        {
        }
    }
} 