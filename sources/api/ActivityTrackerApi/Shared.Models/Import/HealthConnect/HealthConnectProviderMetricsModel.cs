namespace Shared.Models.Import.HealthConnect
{
    public class HealthConnectProviderMetricsModel
    {
        public List<HealthConnectSource> Providers { get; set; } = [];
        public List<HealthConnectMetric> Metrics { get; set; } = [];
    }
}
