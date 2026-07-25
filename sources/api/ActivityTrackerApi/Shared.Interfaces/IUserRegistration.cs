using Shared.Models.Authentication;

namespace Shared.Interfaces
{
    public interface IUserRegistration
    {
        public Task<bool> RegisterUser(UserRegistrationRequest request);
    }
}
