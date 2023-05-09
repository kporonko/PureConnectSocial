using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PureConnectBackend.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CascadeDeletePostReportsOnPostDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PostReport_Post_PostId",
                table: "PostReport");

            migrationBuilder.AddForeignKey(
                name: "FK_PostReport_Post_PostId",
                table: "PostReport",
                column: "PostId",
                principalTable: "Post",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PostReport_Post_PostId",
                table: "PostReport");

            migrationBuilder.AddForeignKey(
                name: "FK_PostReport_Post_PostId",
                table: "PostReport",
                column: "PostId",
                principalTable: "Post",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
