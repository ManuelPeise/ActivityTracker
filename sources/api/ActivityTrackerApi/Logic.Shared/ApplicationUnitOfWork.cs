using Data.Db.Repositories;
using Data.Db.Repositories.Interfaces;
using Data.Db.Entities.Authentication;
using Data.Db;
using Logic.Shared.Interfaces;

namespace Logic.Shared
{
    public class ApplicationUnitOfWork: IApplicationUnitOfWork
    {
        private readonly AppDbContext _dbContext;
        private IDbRepositoryBase<UserEntity>? _userTable;
        private IDbRepositoryBase<UserAuthenticationEntity>? _userAuthenticationTable;
        private IDbRepositoryBase<DataSyncConnectionEntity>? _dataSyncConnectionTable;

        public IDbRepositoryBase<UserEntity> UserTable => _userTable ?? new DbRepositoryBase<UserEntity>(_dbContext);
        public IDbRepositoryBase<UserAuthenticationEntity> UserAuthenticationTable => _userAuthenticationTable ?? new DbRepositoryBase<UserAuthenticationEntity>(_dbContext);
        public IDbRepositoryBase<DataSyncConnectionEntity> DataSyncConnectionTable => _dataSyncConnectionTable ?? new DbRepositoryBase<DataSyncConnectionEntity>(_dbContext);

        public ApplicationUnitOfWork(AppDbContext dbContext)
        {
            _dbContext = dbContext;
            InitializeRepositories(dbContext);
        }

        private void InitializeRepositories(AppDbContext dbContext)
        {
            _userTable = new DbRepositoryBase<UserEntity>(dbContext);
            _userAuthenticationTable = new DbRepositoryBase<UserAuthenticationEntity>(dbContext);
            _dataSyncConnectionTable = new DbRepositoryBase<DataSyncConnectionEntity>(dbContext);
        }

        
    }
}
