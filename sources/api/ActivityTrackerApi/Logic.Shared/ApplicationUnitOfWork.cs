using Data.Db;
using Data.Db.Entities;
using Logic.Shared.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Logic.Shared.Repositories;

namespace Logic.Shared
{
    public class ApplicationUnitOfWork : IApplicationUnitOfWork
    {
        private readonly AppDbContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        private IUserRepository? _userRepository;
        private IHealthConnectRepository? _healthConnectRepository;

        public IUserRepository UserRepository => _userRepository ??= new UserRepository(_dbContext, _httpContextAccessor);
        public IHealthConnectRepository HealthConnectRepository => _healthConnectRepository ??= new HealthConnectRepository(_dbContext, _httpContextAccessor);

        public ApplicationUnitOfWork(AppDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        }

        public async Task SaveChangesAsync(string userName = "System")
        {
            if (_dbContext == null) throw new ObjectDisposedException(nameof(ApplicationUnitOfWork));

            var user = _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? userName;

            var now = DateTime.UtcNow;

            var entries = _dbContext.ChangeTracker.Entries<AEntityBase>();

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

            await _dbContext.SaveChangesAsync();
        }
    }
}
