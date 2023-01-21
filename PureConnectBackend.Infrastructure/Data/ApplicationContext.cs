using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PureConnectBackend.Infrastructure.Configuration;
using PureConnectBackend.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace PureConnectBackend.Infrastructure.Data
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Follow> Follows { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<PostLike> PostsLikes { get; set; }
        public DbSet<PostComment> PostsComments { get; set; }
        public DbSet<PostCommentLike> PostsCommentsLikes { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<PostReport> PostsReports { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new FollowConfiguration());
            modelBuilder.ApplyConfiguration(new PostConfiguration());
            modelBuilder.ApplyConfiguration(new PostLikeConfiguration());
            modelBuilder.ApplyConfiguration(new PostCommentConfiguration());
            modelBuilder.ApplyConfiguration(new PostCommentLikeConfiguration());
            modelBuilder.ApplyConfiguration(new ReportConfiguration());
            modelBuilder.ApplyConfiguration(new PostReportConfiguration());

            modelBuilder.Entity<Follow>()
                .HasKey(k => k.Id);

            modelBuilder.Entity<Follow>()
                .HasOne(u => u.Followee)
                .WithMany(u => u.Follower)
                .HasForeignKey(u => u.FollowerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Follow>()
                .HasOne(u => u.Follower)
                .WithMany(u => u.Followee)
                .HasForeignKey(u => u.FolloweeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Post>()
                .HasOne(u => u.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PostLike>()
                .HasOne(u => u.User)
                .WithMany(u => u.PostsLikes)
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<PostLike>()
                .HasOne(u => u.Post)
                .WithMany(u => u.PostLikes)
                .HasForeignKey(u => u.PostId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PostComment>()
                .HasOne(u => u.ParentComment)
                .WithMany(u => u.CommentReplies)
                .HasForeignKey(u => u.ParentCommentId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<PostComment>()
                .HasOne(u => u.User)
                .WithMany(u => u.PostsComments)
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<PostComment>()
                .HasOne(u => u.Post)
                .WithMany(u => u.PostComments)
                .HasForeignKey(u => u.PostId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PostCommentLike>()
                .HasOne(u => u.User)
                .WithMany(u => u.PostsCommentsLikes)
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<PostCommentLike>()
                .HasOne(u => u.PostComment)
                .WithMany(u => u.PostCommentLikes)
                .HasForeignKey(u => u.PostCommentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PostReport>()
                .HasOne(u => u.User)
                .WithMany(u => u.PostsReports)
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<PostReport>()
                .HasOne(u => u.Post)
                .WithMany(u => u.PostReports)
                .HasForeignKey(u => u.PostId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Report>()
                .HasOne(u => u.User)
                .WithMany(u => u.Reports)
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json")
                .Build();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("Default"));
        }
    }
}
