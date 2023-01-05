﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PureConnectBackend.Infrastructure.Data;

#nullable disable

namespace PureConnectBackend.Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationContext))]
    [Migration("20230105130516_PostCommentEntityAdded")]
    partial class PostCommentEntityAdded
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("PureConnectBackend.Infrastructure.Models.Follow", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("Id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("FolloweeId")
                        .HasColumnType("int");

                    b.Property<int>("FollowerId")
                        .HasColumnType("int");

                    b.Property<DateTime>("RequestDate")
                        .HasColumnType("date")
                        .HasColumnName("RequestDate");

                    b.HasKey("Id");

                    b.HasIndex("FolloweeId");

                    b.HasIndex("FollowerId");

                    b.ToTable("Follow", (string)null);
                });

            modelBuilder.Entity("PureConnectBackend.Infrastructure.Models.Post", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("Id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime")
                        .HasColumnName("CreatedAt");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("varchar(max)")
                        .HasColumnName("Description");

                    b.Property<string>("Image")
                        .HasColumnType("varchar(max)")
                        .HasColumnName("Image");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Post", (string)null);
                });

            modelBuilder.Entity("PureConnectBackend.Infrastructure.Models.PostComment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("Id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("CommentText")
                        .IsRequired()
                        .HasColumnType("varchar(max)")
                        .HasColumnName("Description");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime")
                        .HasColumnName("CreatedAt");

                    b.Property<int?>("ParentCommentId")
                        .IsRequired()
                        .HasColumnType("int");

                    b.Property<int>("PostId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ParentCommentId");

                    b.HasIndex("PostId");

                    b.HasIndex("UserId");

                    b.ToTable("PostComment", (string)null);
                });

            modelBuilder.Entity("PureConnectBackend.Infrastructure.Models.PostLike", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("Id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime")
                        .HasColumnName("CreatedAt");

                    b.Property<int>("PostId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("PostId");

                    b.HasIndex("UserId");

                    b.ToTable("PostLike", (string)null);
                });

            modelBuilder.Entity("PureConnectBackend.Infrastructure.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("Id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Avatar")
                        .HasColumnType("varchar(max)")
                        .HasColumnName("Avatar");

                    b.Property<DateTime?>("BirthDate")
                        .HasColumnType("date")
                        .HasColumnName("BirthDate");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar")
                        .HasColumnName("Email");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar")
                        .HasColumnName("FirstName");

                    b.Property<bool>("IsOpenAcc")
                        .HasColumnType("bit")
                        .HasColumnName("IsOpenAcc");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar")
                        .HasColumnName("LastName");

                    b.Property<string>("Location")
                        .HasColumnType("varchar(max)")
                        .HasColumnName("Location");

                    b.Property<string>("Password")
                        .HasColumnType("varchar(max)")
                        .HasColumnName("Password");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("varchar(max)")
                        .HasColumnName("Role");

                    b.Property<string>("Status")
                        .HasColumnType("varchar(max)")
                        .HasColumnName("Status");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("varchar(max)")
                        .HasColumnName("UserName");

                    b.HasKey("Id");

                    b.ToTable("User", (string)null);
                });

            modelBuilder.Entity("PureConnectBackend.Infrastructure.Models.Follow", b =>
                {
                    b.HasOne("PureConnectBackend.Infrastructure.Models.User", "Follower")
                        .WithMany("Followee")
                        .HasForeignKey("FolloweeId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("PureConnectBackend.Infrastructure.Models.User", "Followee")
                        .WithMany("Follower")
                        .HasForeignKey("FollowerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Followee");

                    b.Navigation("Follower");
                });

            modelBuilder.Entity("PureConnectBackend.Infrastructure.Models.Post", b =>
                {
                    b.HasOne("PureConnectBackend.Infrastructure.Models.User", "User")
                        .WithMany("Posts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("PureConnectBackend.Infrastructure.Models.PostComment", b =>
                {
                    b.HasOne("PureConnectBackend.Infrastructure.Models.PostComment", "ParentComment")
                        .WithMany("CommentReplies")
                        .HasForeignKey("ParentCommentId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("PureConnectBackend.Infrastructure.Models.Post", "Post")
                        .WithMany("PostComments")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("PureConnectBackend.Infrastructure.Models.User", "User")
                        .WithMany("PostsComments")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("ParentComment");

                    b.Navigation("Post");

                    b.Navigation("User");
                });

            modelBuilder.Entity("PureConnectBackend.Infrastructure.Models.PostLike", b =>
                {
                    b.HasOne("PureConnectBackend.Infrastructure.Models.Post", "Post")
                        .WithMany("PostLikes")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("PureConnectBackend.Infrastructure.Models.User", "User")
                        .WithMany("PostsLikes")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Post");

                    b.Navigation("User");
                });

            modelBuilder.Entity("PureConnectBackend.Infrastructure.Models.Post", b =>
                {
                    b.Navigation("PostComments");

                    b.Navigation("PostLikes");
                });

            modelBuilder.Entity("PureConnectBackend.Infrastructure.Models.PostComment", b =>
                {
                    b.Navigation("CommentReplies");
                });

            modelBuilder.Entity("PureConnectBackend.Infrastructure.Models.User", b =>
                {
                    b.Navigation("Followee");

                    b.Navigation("Follower");

                    b.Navigation("Posts");

                    b.Navigation("PostsComments");

                    b.Navigation("PostsLikes");
                });
#pragma warning restore 612, 618
        }
    }
}