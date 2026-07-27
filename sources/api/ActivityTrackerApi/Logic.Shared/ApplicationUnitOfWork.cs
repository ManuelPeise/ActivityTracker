using Data.Db;
using Data.Db.Entities;
using Data.Db.Entities.Authentication;
using Data.Db.Repositories;
using Data.Db.Repositories.Interfaces;
using Logic.Shared.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Data.Db.Entities.Import;

namespace Logic.Shared
{
    public class ApplicationUnitOfWork : IApplicationUnitOfWork
    {
        private readonly AppDbContext _dbContext;
        private readonly HttpContext _httpContext;
        private IDbRepositoryBase<UserEntity>? _userTable;
        private IDbRepositoryBase<UserAuthenticationEntity>? _userAuthenticationTable;
        private IDbRepositoryBase<DataSyncConnectionEntity>? _dataSyncConnectionTable;
        private IDbRepositoryBase<ImportConfigurationEntity>? _importConfigurationTable;

        public IDbRepositoryBase<UserEntity> UserTable => _userTable ?? new DbRepositoryBase<UserEntity>(_dbContext);
        public IDbRepositoryBase<UserAuthenticationEntity> UserAuthenticationTable => _userAuthenticationTable ?? new DbRepositoryBase<UserAuthenticationEntity>(_dbContext);
        public IDbRepositoryBase<DataSyncConnectionEntity> DataSyncConnectionTable => _dataSyncConnectionTable ?? new DbRepositoryBase<DataSyncConnectionEntity>(_dbContext);
        public IDbRepositoryBase<ImportConfigurationEntity> ImportConfigurationTable => _importConfigurationTable ?? new DbRepositoryBase<ImportConfigurationEntity>(_dbContext);

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
            _userTable = new DbRepositoryBase<UserEntity>(dbContext);
            _userAuthenticationTable = new DbRepositoryBase<UserAuthenticationEntity>(dbContext);
            _dataSyncConnectionTable = new DbRepositoryBase<DataSyncConnectionEntity>(dbContext);
            _importConfigurationTable = new DbRepositoryBase<ImportConfigurationEntity>(dbContext);
        }


    }
}
