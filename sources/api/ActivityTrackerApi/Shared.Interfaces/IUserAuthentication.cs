using Shared.Models.Authentication;

namespace Shared.Interfaces
{
    public interface IUserAuthentication
    {
        Task<TokenResponse?> Authenticate(AuthenticateUserRequest request);
    }
}
