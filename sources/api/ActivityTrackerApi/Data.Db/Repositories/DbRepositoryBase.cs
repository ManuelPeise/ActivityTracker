using Data.Db.Entities;
using Data.Db.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Data.Db.Repositories
{
    public class DbRepositoryBase<TEntity> : IDbRepositoryBase<TEntity> where TEntity : AEntityBase   
    {
        private readonly AppDbContext _appDbContext;
        
        public DbRepositoryBase(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<HashSet<TEntity>> GetAll(
            bool asNoTracking = false, 
            params Func<IQueryable<TEntity>, IQueryable<TEntity>>[]? includes)
        {
            IQueryable<TEntity> table = asNoTracking
                 ? _appDbContext.Set<TEntity>().AsNoTracking()
                 : _appDbContext.Set<TEntity>();

            if (includes != null)
            {
                foreach (var includeExpression in includes)
                {
                    if (includeExpression != null)
                    {
                        table = includeExpression(table);
                    }
                }
            }

            return await table.ToHashSetAsync();
        }

        public async Task<HashSet<TEntity>> GetBy(
            Expression<Func<TEntity, bool>> predicate,
            bool asNoTracking = false,
            params Func<IQueryable<TEntity>, IQueryable<TEntity>>[]? includes)
        {
            IQueryable<TEntity> table = asNoTracking
                ? _appDbContext.Set<TEntity>().AsNoTracking()
                : _appDbContext.Set<TEntity>();

            if (includes != null)
            {
                foreach (var includeExpression in includes)
                {
                    if (includeExpression != null)
                    {
                        table = includeExpression(table);
                    }
                }
            }

            table = table.Where(predicate);

            return await table.ToHashSetAsync();
        }

        public async Task<TEntity?> GetById(
             int id,
             bool asNoTracking = false,
             params Func<IQueryable<TEntity>, IQueryable<TEntity>>[]? includes)
        {
            IQueryable<TEntity> table = asNoTracking
                ? _appDbContext.Set<TEntity>().AsNoTracking()
                : _appDbContext.Set<TEntity>();

            if (includes != null)
            {
                foreach (var includeExpression in includes)
                {
                    if (includeExpression != null)
                    {
                        table = includeExpression(table);
                    }
                }
            }

            return await table.FirstOrDefaultAsync(e => e.Id == id) ?? null;
        }

        public async Task<bool> Insert(TEntity entity, Expression<Func<TEntity, bool>>? predicate)
        {
            var table = _appDbContext.Set<TEntity>();

            var existingEntity = predicate != null ? await table.FirstOrDefaultAsync(predicate) : null;

            if (existingEntity == null)
            {
                await table.AddAsync(entity);
                return true;
            }

            return false;
        }

        public async Task<bool> Delete(int id)
        {
            var entity = await _appDbContext.Set<TEntity>().FindAsync(id);

            if (entity != null)
            {
                _appDbContext.Set<TEntity>().Remove(entity);
                return true;
            }
            return false;
        }
    }
}
