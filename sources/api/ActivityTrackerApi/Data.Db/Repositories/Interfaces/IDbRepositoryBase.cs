using Data.Db.Entities;
using System.Linq.Expressions;

namespace Data.Db.Repositories.Interfaces
{
    public interface IDbRepositoryBase<TEntity> where TEntity : AEntityBase
    {
        Task<HashSet<TEntity>> GetAll(
            bool asNoTracking = false,
            params Func<IQueryable<TEntity>, IQueryable<TEntity>>[]? includes);

        Task<HashSet<TEntity>> GetBy(
            Expression<Func<TEntity, bool>> predicate,
            bool asNoTracking = false,
            params Func<IQueryable<TEntity>, IQueryable<TEntity>>[]? includes);

        Task<TEntity?> GetById(
            int id,
            bool asNoTracking = false,
            params Func<IQueryable<TEntity>, IQueryable<TEntity>>[]? includes);

        Task<bool> Insert(TEntity entity, Expression<Func<TEntity, bool>>? predicate);

        Task<bool> Update(TEntity entity, Expression<Func<TEntity, bool>>? predicate);
        Task<bool> Delete(int id);
    }
}
