using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Data.Db
{
    public static class DbMigrator
    {
        public static async Task MigrateDatabaseAsync(AppDbContext context, ILogger? logger = null, CancellationToken cancellationToken = default)
        {
            ArgumentNullException.ThrowIfNull(context);

            try
            {
                var pendingMigrations = await context.Database.GetPendingMigrationsAsync(cancellationToken);
                var pendingMigrationsList = pendingMigrations.ToList();

                if (pendingMigrationsList.Count == 0)
                {
                    logger?.LogInformation("No pending migrations found");
                    return;
                }

                logger?.LogInformation("Found {Count} pending migration(s): {Migrations}", 
                    pendingMigrationsList.Count, 
                    string.Join(", ", pendingMigrationsList));

                await context.Database.MigrateAsync(cancellationToken);

                logger?.LogInformation("Database migration completed successfully");
            }
            catch (Exception ex)
            {
                logger?.LogError(ex, "Database migration failed");
                throw;
            }
        }
    }
}
