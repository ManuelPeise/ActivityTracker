using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace Data.Db.Migrations
{
    /// <inheritdoc />
    public partial class InitDbMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DataSyncConnectionTable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    DevideId = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    CreatedBy = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedBy = table.Column<string>(type: "longtext", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DataSyncConnectionTable", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UserAuthenticationTable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Password = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    Salt = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    PasswordExpiresAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    RefreshToken = table.Column<string>(type: "longtext", nullable: true),
                    RefreshTokenExpiresAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CreatedBy = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedBy = table.Column<string>(type: "longtext", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAuthenticationTable", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UserTable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    FirstName = table.Column<string>(type: "longtext", nullable: false),
                    LastName = table.Column<string>(type: "longtext", nullable: false),
                    EmailAddress = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UserAuthenticationId = table.Column<int>(type: "int", nullable: false),
                    UserDataSyncId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedBy = table.Column<string>(type: "longtext", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTable", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserTable_DataSyncConnectionTable_UserDataSyncId",
                        column: x => x.UserDataSyncId,
                        principalTable: "DataSyncConnectionTable",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserTable_UserAuthenticationTable_UserAuthenticationId",
                        column: x => x.UserAuthenticationId,
                        principalTable: "UserAuthenticationTable",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_UserTable_UserAuthenticationId",
                table: "UserTable",
                column: "UserAuthenticationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserTable_UserDataSyncId",
                table: "UserTable",
                column: "UserDataSyncId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserTable");

            migrationBuilder.DropTable(
                name: "DataSyncConnectionTable");

            migrationBuilder.DropTable(
                name: "UserAuthenticationTable");
        }
    }
}
