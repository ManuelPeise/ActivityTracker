using Shared.Enums;

namespace Shared.Models.Import.HealthConnect
{
    public class HealthConnectConfiguration
    {
        public Guid ConnectionGuid { get; set; }
        public ConnectionStatus Status { get; set; }
        public bool IsActive { get; set; }
        public bool IsInitialLoad { get; set; }
        public int SelectedProviderId { get; set; } = -1;
        public List<HealthConnectProvider> AvailableProviders { get; set; } = [];
        public List<int> SelectedMetricIds { get; set; } = [];
        public List<HealthConnectMetric> Metrics { get; set; } = [];
        public string UpdatedAt { get; set; } = string.Empty;
        public string UpdatedBy { get; set; } = string.Empty;
    }
}
