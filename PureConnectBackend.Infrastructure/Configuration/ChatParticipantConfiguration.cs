using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PureConnectBackend.Infrastructure.Models;

namespace PureConnectBackend.Infrastructure.Configuration
{
    public class ChatParticipantConfiguration : IEntityTypeConfiguration<ChatParticipant>
    {
        public void Configure(EntityTypeBuilder<ChatParticipant> builder)
        {
            builder.HasKey(cp => cp.Id);

            builder.Property(cp => cp.JoinedAt)
                .IsRequired();
        }
    }
} 