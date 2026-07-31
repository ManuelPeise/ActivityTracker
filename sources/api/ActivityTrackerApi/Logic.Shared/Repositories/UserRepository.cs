using Data.Db;
using Data.Db.Entities.Authentication;
using Data.Db.Repositories;
using Data.Db.Repositories.Interfaces;
using Logic.Shared.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Logic.Shared.Repositories
{
    public class UserRepository : ARepositoryBase, IUserRepository
    {
       
        private IDbRepositoryBase<UserEntity>? _userTable;
        private IDbRepositoryBase<UserAuthenticationEntity>? _userAuthenticationTable;

        public IDbRepositoryBase<UserEntity> UserTable => _userTable ?? new DbRepositoryBase<UserEntity>(DbContext);
        public IDbRepositoryBase<UserAuthenticationEntity> UserAuthenticationTable => _userAuthenticationTable ?? new DbRepositoryBase<UserAuthenticationEntity>(DbContext);

        public UserRepository(AppDbContext dbContext, HttpContext httpContext): base(dbContext, httpContext)
        {
            InitializeRepositories(dbContext);
        }

        private void InitializeRepositories(AppDbContext dbContext)
        {
            _userTable = new DbRepositoryBase<UserEntity>(dbContext);
            _userAuthenticationTable = new DbRepositoryBase<UserAuthenticationEntity>(dbContext);
        }
    }
}
