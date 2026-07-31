using Data.Db.Entities.Authentication;
using Logic.Shared.Interfaces;
using Microsoft.Extensions.Logging;
using Shared.Interfaces;
using Shared.Models.Authentication;

namespace Logic.AuthenticationService
{
    internal class UserRegistration : IUserRegistration
    {
        private readonly IApplicationUnitOfWork _applicationUnitOfWork;
        private readonly ILogger<UserRegistration> _logger;

        public UserRegistration(IApplicationUnitOfWork applicationUnitOfWork, ILogger<UserRegistration> logger)
        {
            _applicationUnitOfWork = applicationUnitOfWork;
            _logger = logger;
        }
        public async Task<bool> RegisterUser(UserRegistrationRequest request)
        {
            try
            {
                var isValid = ValidateUserRegistrationRequest(request);

                if (!isValid)
                {
                    _logger.LogWarning("User registration request is invalid.");
                    return false;
                }

                var passwordHasher = new PasswordHasher();

                var entity = new UserEntity
                {
                    Id = 0,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    EmailAddress = request.EmailAddress,
                    DateOfBirth = request.DateOfBirth,
                    UserAuthentication = new UserAuthenticationEntity
                    {
                        Password = passwordHasher.HashPassword(request.Password),
                        Salt = Guid.NewGuid().ToString(),
                        PasswordExpiresAt = DateTime.UtcNow.AddMonths(3)
                    },
                };

                var isInserted = await _applicationUnitOfWork.UserRepository.UserTable.Insert(entity, e => e.EmailAddress == request.EmailAddress);

                if (isInserted)
                {
                    await _applicationUnitOfWork.SaveChangesAsync();

                    _logger.LogInformation("User registered successfully.");
                    return true;
                }
                else
                {
                    _logger.LogWarning("User registration failed.");
                    return false;
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "An error occurred while registering the user.");
                return false;
            }
        }

        private bool ValidateUserRegistrationRequest(UserRegistrationRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.FirstName))
                return false;
            if (string.IsNullOrWhiteSpace(request.LastName))
                return false;
            if (string.IsNullOrWhiteSpace(request.EmailAddress))
                return false;
            if (request.DateOfBirth == default)
                return false;
            if (string.IsNullOrWhiteSpace(request.Password))
                return false;
            return true;
        }
    }
}
