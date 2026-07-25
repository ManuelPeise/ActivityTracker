using Data.Db;

namespace Core.Api.Bundels
{
    internal static class AppConfiguration
    {
        internal static async Task ConfigureApp(WebApplication app, string corsPolicyName)
        {
            if (app.Environment.IsDevelopment())
            {
                // Development-specific configuration
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.UseCors(corsPolicyName);
            app.MapControllers();

            await DbMigrator.MigrateDatabaseAsync(
                app.Services.CreateScope().ServiceProvider.GetRequiredService<AppDbContext>(),
                app.Services.CreateScope().ServiceProvider.GetRequiredService<ILogger<AppDbContext>>());
        }
    }
}
