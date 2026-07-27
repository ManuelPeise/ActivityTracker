using Data.Db.Entities.Authentication;
using Data.Db.Entities.Import;
using Data.Db.Repositories.Interfaces;

namespace Logic.Shared.Interfaces
{
    public interface IApplicationUnitOfWork
    {
        public IDbRepositoryBase<UserEntity> UserTable { get; }
        public IDbRepositoryBase<UserAuthenticationEntity> UserAuthenticationTable { get; }
        public IDbRepositoryBase<DataSyncConnectionEntity> DataSyncConnectionTable { get; }
        public IDbRepositoryBase<ImportConfigurationEntity> ImportConfigurationTable { get; }
        public Task SaveChangesAsync(string userName = "System");
    }
}
