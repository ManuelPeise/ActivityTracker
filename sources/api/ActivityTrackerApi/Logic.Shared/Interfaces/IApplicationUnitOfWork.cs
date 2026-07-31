namespace Logic.Shared.Interfaces
{
    public interface IApplicationUnitOfWork
    {
        public IUserRepository UserRepository { get; }
        public IHealthConnectRepository HealthConnectRepository  { get; }
        public Task SaveChangesAsync(string userName = "System");
    }
}
