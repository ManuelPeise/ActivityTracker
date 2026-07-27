using Shared.Enums;

namespace Shared.Models.Import.HealthConnect
{
    public class HealthConnectConfiguration
    {
        public Guid ConnectionGuid { get; set; }
        public ConnectionStatus Status { get; set; }
        public bool IsActive { get; set; }
        public int SelectedProviderId { get; set; } = -1;
        public List<HealthConnectProvider> AvailableProviders { get; set; } = [];
        public List<HealthConnectMetric> Metrics { get; set; } = [];
    }
}
