﻿using Microsoft.EntityFrameworkCore.Migrations;

namespace HackersPortal.DataAccess.Migrations
{
    public partial class metaTags : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MetaTags",
                table: "Documents",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MetaTags",
                table: "Documents");
        }
    }
}
