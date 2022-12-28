using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PureConnectBackend.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PureConnectBackend.Infrastructure.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder
                .ToTable("User")
                .HasKey(t => t.Id);
            builder
                .Property(t => t.Id)
                .IsRequired()
                .HasColumnName("Id")
                .HasColumnType("int")
                .ValueGeneratedOnAdd();
            builder
                .Property(t => t.LastName)
                .IsRequired()
                .HasColumnName("LastName")
                .HasColumnType("varchar")
                .HasMaxLength(50);
            builder
                .Property(t => t.FirstName)
                .IsRequired()
                .HasColumnName("FirstName")
                .HasColumnType("varchar")
                .HasMaxLength(50);
            builder
                .Property(t => t.BirthDate)
                .IsRequired(false)
                .HasColumnName("BirthDate")
                .HasColumnType("date");
            builder
                .Property(t => t.Email)
                .IsRequired()
                .HasColumnName("Email")
                .HasColumnType("varchar")
                .HasMaxLength(100);
            builder
                .Property(t => t.Password)
                .IsRequired(false)
                .HasColumnName("Password")
                .HasColumnType("varchar(max)");
            builder
                .Property(t => t.IsOpenAcc)
                .IsRequired(true)
                .HasColumnName("IsOpenAcc")
                .HasColumnType("bit");
            builder
                .Property(t => t.Location)
                .IsRequired(false)
                .HasColumnName("Location")
                .HasColumnType("varchar(max)");
            builder
                .Property(t => t.Status)
                .HasColumnName("Status")
                .IsRequired(false)
                .HasColumnType("varchar(max)");
            builder
                .Property(t => t.Avatar)
                .IsRequired(false)
                .HasColumnName("Avatar")
                .HasColumnType("varchar(max)");
            builder
                .Property(t => t.Role)
                .IsRequired(true)
                .HasColumnName("Role")
                .HasColumnType("varchar(max)");
            builder
                .Property(t => t.UserName)
                .IsRequired(true)
                .HasColumnName("UserName")
                .HasColumnType("varchar(max)");
        }
    }
}
