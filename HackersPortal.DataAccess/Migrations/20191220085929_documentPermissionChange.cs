using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HackersPortal.DataAccess.Migrations
{
    public partial class documentPermissionChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "DocumentPermissions");

            migrationBuilder.DropColumn(
                name: "DeletedOn",
                table: "DocumentPermissions");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "DocumentPermissions");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                table: "DocumentPermissions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedOn",
                table: "DocumentPermissions",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "DocumentPermissions",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
