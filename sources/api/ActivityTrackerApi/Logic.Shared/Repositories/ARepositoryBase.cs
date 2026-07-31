using Data.Db;
using Data.Db.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Logic.Shared.Repositories
{
    public class ARepositoryBase
    {
        protected readonly AppDbContext DbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ARepositoryBase(AppDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            DbContext = dbContext;
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        }

        public async Task SaveChangesAsync(string userName = "System")
        {
            if (DbContext == null) throw new ObjectDisposedException(nameof(ApplicationUnitOfWork));

            var user = _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? userName;

            var now = DateTime.UtcNow;

            var entries = DbContext.ChangeTracker.Entries<AEntityBase>();

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedAt = now;
                    entry.Entity.UpdatedAt = now;
                    entry.Entity.CreatedBy = user;
                    entry.Entity.UpdatedBy = user;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Property(nameof(AEntityBase.CreatedAt)).IsModified = false;
                    entry.Property(nameof(AEntityBase.CreatedBy)).IsModified = false;

                    entry.Entity.UpdatedAt = now;
                    entry.Entity.UpdatedBy = user;
                }
            }

            await DbContext.SaveChangesAsync();
        }
    }
}
