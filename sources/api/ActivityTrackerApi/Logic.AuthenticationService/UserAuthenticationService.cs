using Logic.Shared.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Shared.Interfaces;
using Shared.Models.Authentication;

namespace Logic.AuthenticationService
{
    public class UserAuthenticationService: IUserAuthentication
    {
        private IApplicationUnitOfWork _applicationUnitOfWork;
        private readonly IJwtTokenService _jwtTokenService;
        private ILogger<UserAuthenticationService> _logger;

        public UserAuthenticationService(IApplicationUnitOfWork applicationUnitOfWork, IJwtTokenService jwtTokenService, ILogger<UserAuthenticationService> logger)
        {
            _applicationUnitOfWork = applicationUnitOfWork;
            _jwtTokenService = jwtTokenService;
            _logger = logger;
        }

        public async Task<TokenResponse?> Authenticate(AuthenticateUserRequest request)
        {
            try
            {
                if(string.IsNullOrWhiteSpace(request.EmailAddress) || string.IsNullOrWhiteSpace(request.Password))
                {
                    _logger.LogWarning("Authentication failed for user {User}. Email or password is empty.", request.EmailAddress);
                    return null;
                }

                var users = await _applicationUnitOfWork.UserRepository.UserTable.GetBy(
                    user => user.EmailAddress == request.EmailAddress, 
                    true,
                    user => user.Include(u => u.UserAuthentication));

                if(!users.Any() || users.Count() > 1)
                {
                    _logger.LogWarning("Authentication failed for user {User}. User not found or multiple users found.", request.EmailAddress);
                    return null;
                }

                var user = users.First();
                var passwordHasher = new PasswordHasher();

                if (!passwordHasher.VerifyPassword(request.Password, user.UserAuthentication.Password))
                {
                    _logger.LogWarning("Authentication failed for user {User}. Incorrect password.", request.EmailAddress);
                    return null;
                }

                var (accessToken, refreshToken) = _jwtTokenService.GenerateTokens(user, request.ClientType);
                var isUpdated = false;
                
                if (accessToken != null)
                {
                    user.UserAuthentication.RefreshToken = refreshToken;
                    user.UserAuthentication.RefreshTokenExpiresAt = DateTime.UtcNow.AddSeconds(_jwtTokenService.GetJwtExpireSeconds());

                    isUpdated = await _applicationUnitOfWork.UserRepository.UserTable.Update(user, u => u.Id == user.Id);
                }

                if (isUpdated)
                {
                    await _applicationUnitOfWork.SaveChangesAsync();
                    _logger.LogInformation("User {User} authenticated successfully.", request.EmailAddress);
                }
                
                return new TokenResponse
                {
                    Jwt = accessToken,
                    RefreshToken = refreshToken
                };
            }
            catch(Exception exception)
            {
                _logger.LogError(exception, "Error occurred while authenticating user {User}.", request.EmailAddress);

                return null;
            }
        }
    }
}
