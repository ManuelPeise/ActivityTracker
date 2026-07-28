namespace Shared.Models.Import.HealthConnect
{
    public class HealthConnectImportModel
    {
        public List<HealthConnectMetric> Metrics { get; set; } = [];
        public List<HealthConnectProvider> Providers { get; set; } = [];
    }
}
