using Data.Db.Entities.Authentication;
using Data.Db.Repositories.Interfaces;

namespace Logic.Shared.Interfaces
{
    public interface IUserRepository
    {
        public IDbRepositoryBase<UserEntity> UserTable {  get; }
        public IDbRepositoryBase<UserAuthenticationEntity> UserAuthenticationTable {  get; }
        Task SaveChanges(string userName = "System");
    }
}
