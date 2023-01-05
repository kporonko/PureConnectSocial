using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using PureConnectBackend.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Infrastructure.Configuration
{
    public class PostCommentLikeConfiguration : IEntityTypeConfiguration<PostCommentLike>
    {
        public void Configure(EntityTypeBuilder<PostCommentLike> builder)
        {
            builder
                .ToTable(nameof(PostCommentLike))
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
        }
    }
}
