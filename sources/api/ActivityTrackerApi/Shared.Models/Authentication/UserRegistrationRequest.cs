namespace Shared.Models.Authentication
{
    public class UserRegistrationRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string EmailAddress { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Password { get; set; } = string.Empty;
    }
}
