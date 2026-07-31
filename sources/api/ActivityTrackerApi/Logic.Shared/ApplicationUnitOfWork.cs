using Data.Db;
using Data.Db.Entities;
using Data.Db.Entities.Authentication;
using Data.Db.Repositories;
using Data.Db.Repositories.Interfaces;
using Logic.Shared.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Logic.Shared.Repositories;

namespace Logic.Shared
{
    public class ApplicationUnitOfWork : IApplicationUnitOfWork
    {
        private readonly AppDbContext _dbContext;
        private readonly HttpContext _httpContext;

        private IUserRepository? _userRepository;
        private IHealthConnectRepository? _healthConnectRepository;

        public IUserRepository UserRepository => _userRepository ?? new UserRepository(_dbContext, _httpContext);
        public IHealthConnectRepository HealthConnectRepository => _healthConnectRepository ?? new HealthConnectRepository(_dbContext, _httpContext);

        public ApplicationUnitOfWork(AppDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _httpContext = httpContextAccessor.HttpContext ?? throw new ArgumentNullException(nameof(httpContextAccessor.HttpContext));
            InitializeRepositories(dbContext);
        }

        public async Task SaveChangesAsync(string userName = "System")
        {
            if (_dbContext == null) throw new ObjectDisposedException(nameof(ApplicationUnitOfWork));

            var user = _httpContext.User.Identity?.Name ?? userName;

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


        private void InitializeRepositories(AppDbContext dbContext)
        {
            _userRepository = new UserRepository(dbContext, _httpContext);
            _healthConnectRepository = new HealthConnectRepository(dbContext, _httpContext);
        }


    }
}
