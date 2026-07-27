using Data.Db.Entities.Authentication;

namespace Logic.Shared.Interfaces
{
    public interface IUserSecurity
    {
        CurrentUserModel CurrentUser { get; }
    }
}
