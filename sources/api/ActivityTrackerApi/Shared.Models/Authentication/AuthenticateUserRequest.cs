namespace Shared.Models.Authentication
{
    public class AuthenticateUserRequest
    {
        public string EmailAddress { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ClientType { get; set; } = string.Empty;
    }
}
