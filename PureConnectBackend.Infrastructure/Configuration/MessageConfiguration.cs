using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PureConnectBackend.Infrastructure.Models;

namespace PureConnectBackend.Infrastructure.Configuration
{
    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        public void Configure(EntityTypeBuilder<Message> builder)
        {
            builder.HasKey(m => m.Id);

            builder.Property(m => m.Content)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Property(m => m.Timestamp)
                .IsRequired();
        }
    }
} 