namespace Shared.Models.Authentication
{
    public class RefreshTokenRequest: TokenResponse
    {
        public string ClientType { get; set; } = string.Empty;
    }
}
