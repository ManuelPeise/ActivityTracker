using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace Data.Db.Migrations
{
    /// <inheritdoc />
    public partial class InitDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "HealthConnectMetricTable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    CreatedBy = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedBy = table.Column<string>(type: "longtext", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthConnectMetricTable", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "HealthConnectSourceTable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    CreatedBy = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedBy = table.Column<string>(type: "longtext", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthConnectSourceTable", x => x.Id);
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
                    CreatedBy = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedBy = table.Column<string>(type: "longtext", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTable", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserTable_UserAuthenticationTable_UserAuthenticationId",
                        column: x => x.UserAuthenticationId,
                        principalTable: "UserAuthenticationTable",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "HealthConnectConfiguration",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    DeviceId = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    DeviceName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    SyncClientId = table.Column<string>(type: "longtext", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedBy = table.Column<string>(type: "longtext", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthConnectConfiguration", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthConnectConfiguration_UserTable_UserId",
                        column: x => x.UserId,
                        principalTable: "UserTable",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "HealthConnectMetricMapping",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Source = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    DisplayName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    IsGranted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    MetricId = table.Column<int>(type: "int", nullable: false),
                    HealthConnectConfigurationEntityId = table.Column<int>(type: "int", nullable: true),
                    CreatedBy = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedBy = table.Column<string>(type: "longtext", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthConnectMetricMapping", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthConnectMetricMapping_HealthConnectConfiguration_Health~",
                        column: x => x.HealthConnectConfigurationEntityId,
                        principalTable: "HealthConnectConfiguration",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HealthConnectMetricMapping_HealthConnectMetricTable_MetricId",
                        column: x => x.MetricId,
                        principalTable: "HealthConnectMetricTable",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "HealthConnectSourceMapping",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Source = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    DisplayName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    SourceId = table.Column<int>(type: "int", nullable: false),
                    HealthConnectConfigurationEntityId = table.Column<int>(type: "int", nullable: true),
                    CreatedBy = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedBy = table.Column<string>(type: "longtext", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthConnectSourceMapping", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthConnectSourceMapping_HealthConnectConfiguration_Health~",
                        column: x => x.HealthConnectConfigurationEntityId,
                        principalTable: "HealthConnectConfiguration",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HealthConnectSourceMapping_HealthConnectSourceTable_SourceId",
                        column: x => x.SourceId,
                        principalTable: "HealthConnectSourceTable",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_HealthConnectConfiguration_UserId",
                table: "HealthConnectConfiguration",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthConnectMetricMapping_HealthConnectConfigurationEntityId",
                table: "HealthConnectMetricMapping",
                column: "HealthConnectConfigurationEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthConnectMetricMapping_MetricId",
                table: "HealthConnectMetricMapping",
                column: "MetricId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthConnectSourceMapping_HealthConnectConfigurationEntityId",
                table: "HealthConnectSourceMapping",
                column: "HealthConnectConfigurationEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthConnectSourceMapping_SourceId",
                table: "HealthConnectSourceMapping",
                column: "SourceId");

            migrationBuilder.CreateIndex(
                name: "IX_UserTable_UserAuthenticationId",
                table: "UserTable",
                column: "UserAuthenticationId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HealthConnectMetricMapping");

            migrationBuilder.DropTable(
                name: "HealthConnectSourceMapping");

            migrationBuilder.DropTable(
                name: "HealthConnectMetricTable");

            migrationBuilder.DropTable(
                name: "HealthConnectConfiguration");

            migrationBuilder.DropTable(
                name: "HealthConnectSourceTable");

            migrationBuilder.DropTable(
                name: "UserTable");

            migrationBuilder.DropTable(
                name: "UserAuthenticationTable");
        }
    }
}
