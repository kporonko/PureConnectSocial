using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PureConnectBackend.Core.Models.Models;

namespace PureConnectBackend.Infrastructure.Configuration
{
    public class PostCommentConfiguration : IEntityTypeConfiguration<PostComment>
    {
        public void Configure(EntityTypeBuilder<PostComment> builder)
        {
            builder
                .ToTable(nameof(PostComment))
                .HasKey(t => t.Id);
            builder
                .Property(t => t.Id)
                .IsRequired()
                .HasColumnName("Id")
                .HasColumnType("int")
                .ValueGeneratedOnAdd();
            builder
                .Property(t => t.CreatedAt)
                .IsRequired()
                .HasColumnName("CreatedAt")
                .HasColumnType("datetime");
            builder
                 .Property(t => t.CommentText)
                 .IsRequired()
                 .HasColumnName("Description")
                 .HasColumnType("varchar(max)");
        }
    }
}
