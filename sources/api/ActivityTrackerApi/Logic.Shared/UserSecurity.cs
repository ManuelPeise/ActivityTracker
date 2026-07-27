using Data.Db.Entities.Authentication;
using Logic.Shared.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Logic.Shared
{
    public class UserSecurity : IUserSecurity
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IApplicationUnitOfWork _applicationUnitOfWork;
        public CurrentUserModel CurrentUser { get; private set; } = new CurrentUserModel { Id = 0, EmailAddress = string.Empty };
        
        public UserSecurity(IHttpContextAccessor contextAccessor, IApplicationUnitOfWork applicationUnitOfWork)
        {
            _contextAccessor = contextAccessor;
            _applicationUnitOfWork = applicationUnitOfWork;

            Task.Run(async () => CurrentUser = await LoadCurrentUserModel()).Wait();
        }

        private async Task<CurrentUserModel> LoadCurrentUserModel()
        {
            try
            {
                var currentUserId = GetCurrentUserId();

                var userEntity = await _applicationUnitOfWork.UserTable.GetById(currentUserId);

                if(userEntity == null)
                {
                    throw new InvalidOperationException("Could not load current user.");
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
