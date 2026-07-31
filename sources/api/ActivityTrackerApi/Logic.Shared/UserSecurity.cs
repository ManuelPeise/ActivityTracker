using Data.Db;
using Data.Db.Entities.Authentication;
using Logic.Shared.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Logic.Shared
{
    public class UserSecurity : IUserSecurity
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly AppDbContext _dbContext;
        private CurrentUserModel? _currentUser;

        public CurrentUserModel CurrentUser 
        { 
            get
            {
                if (_currentUser == null)
                {
                    _currentUser = LoadCurrentUserModel().GetAwaiter().GetResult();
                }
                return _currentUser;
            }
        }

        public UserSecurity(IHttpContextAccessor contextAccessor, AppDbContext dbContext)
        {
            _contextAccessor = contextAccessor;
            _dbContext = dbContext;
        }

        private async Task<CurrentUserModel> LoadCurrentUserModel()
        {
            try
            {
                var currentUserId = GetCurrentUserId();

                if (currentUserId == 0)
                {
                    return new CurrentUserModel { Id = 0, EmailAddress = string.Empty };
                }

                var userEntity = await _dbContext.UserTable.FirstOrDefaultAsync(u => u.Id == currentUserId);

                if(userEntity == null)
                {
                    return new CurrentUserModel { Id = 0, EmailAddress = string.Empty };
                }

                return new CurrentUserModel
                {
                    Id = userEntity.Id,
                    EmailAddress = userEntity.EmailAddress
                };
            }
            catch(Exception)
            {
                return new CurrentUserModel { Id = 0, EmailAddress = string.Empty };
            }
        }

        private int GetCurrentUserId()
        {
            var userId = _contextAccessor.HttpContext?.User.FindFirst("userId")?.Value;

            return userId != null ? int.Parse(userId) : 0;
        }
    }
}
