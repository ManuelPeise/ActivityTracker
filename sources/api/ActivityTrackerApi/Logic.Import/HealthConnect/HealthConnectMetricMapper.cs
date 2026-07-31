using Data.Db.Entities.HealthConnect;
using Logic.Shared.Interfaces;
using Shared.Models.Import.HealthConnect;

namespace Logic.Import.HealthConnect
{
    internal class HealthConnectMetricMapper : AHealthConnectMapper<HealthConnectMetricMapping>
    {
        public HealthConnectMetricMapper(IHealthConnectRepository healthConnectRepository, int userId)
            : base(healthConnectRepository, userId) { }

        public async Task<HashSet<HealthConnectMetricMapping>> AddMappingsAsync()
        {
            var metrics = Enum.GetNames(typeof(HealthConnectMetrics))
                .Select(name => new HealthConnectMetric
                {
                    Name = name,
                    IsGranted = false
                })
                .ToList();

            var addedMetrics = await AddMetricsAsync(metrics);

            if (addedMetrics.Any())
            {
                var existingMappings = await HealthConnectRepository.HealthConnectMetricMappingTable.GetBy(x => x.UserId == UserId);
                var existingMetricIds = existingMappings.Select(x => x.MetricId).ToHashSet();

                var newMappings = addedMetrics
                    .Where(metric => !existingMetricIds.Contains(metric.Id))
                    .Select(metric => new HealthConnectMetricMappingEntity
                    {
                        UserId = UserId,
                        MetricId = metric.Id,
                        Source = metric.Name,
                        DisplayName = string.Empty,
                        IsActive = false,
                        IsGranted = metric.IsGranted
                    })
                    .ToList();

                foreach (var mapping in newMappings)
                {
                    await HealthConnectRepository.HealthConnectMetricMappingTable.Insert(mapping, x => x.MetricId == mapping.MetricId && x.UserId == UserId);
                }

                if (newMappings.Any())
                {
                    await HealthConnectRepository.SaveChanges();
                    IsDbModified = true;
                }
            }

            return await GetMappingsAsync();
        }

        public override async Task<HashSet<HealthConnectMetricMapping>> GetMappingsAsync()
        {
            var existingMappingEntities = await HealthConnectRepository.HealthConnectMetricMappingTable.GetBy(x => x.UserId == UserId);

            if (!existingMappingEntities.Any())
            {
                var initialMetricNames = Enum.GetNames(typeof(HealthConnectMetrics));

                return initialMetricNames.Select(name => new HealthConnectMetricMapping
                {
                    UserId = UserId,
                    MetricId = (int)Enum.Parse(typeof(HealthConnectMetrics), name),
                    Source = name,
                    DisplayName = string.Empty,
                    IsActive = false,
                    IsGranted = false
                }).ToHashSet();
            }

            return MapToModels(existingMappingEntities);
        }

        public override async Task<HashSet<HealthConnectMetricMapping>> UpdateMappingAsync(HashSet<HealthConnectMetricMapping> mappings)
        {
            if (!mappings.Any())
            {
                return new HashSet<HealthConnectMetricMapping>();
            }

            var mappingIds = mappings.Select(m => m.Id).ToHashSet();
            var existingMappingEntities = await HealthConnectRepository.HealthConnectMetricMappingTable.GetBy(x => x.UserId == UserId && mappingIds.Contains(x.Id));

            var existingEntitiesDict = existingMappingEntities.ToDictionary(x => x.Id);

            foreach (var mapping in mappings)
            {
                if (existingEntitiesDict.TryGetValue(mapping.Id, out var existingMapping))
                {
                    existingMapping.DisplayName = mapping.DisplayName;
                    existingMapping.IsActive = mapping.IsActive;
                    existingMapping.IsGranted = mapping.IsGranted;

                    await HealthConnectRepository.HealthConnectMetricMappingTable.Update(existingMapping, x => x.Id == mapping.Id);
                    IsDbModified = true;
                }
            }

            if (IsDbModified)
            {
                await HealthConnectRepository.SaveChanges();
            }

            var updatedMappings = await HealthConnectRepository.HealthConnectMetricMappingTable.GetBy(x => x.UserId == UserId);

            return MapToModels(updatedMappings);
        }

        private async Task<HashSet<HealthConnectMetric>> AddMetricsAsync(List<HealthConnectMetric> metrics)
        {
            if (!metrics.Any())
            {
                return [];
            }

            var metricNames = metrics.Select(m => m.Name).Distinct().ToList();
            var existingMetrics = await HealthConnectRepository.HealthConnectMetricTable.GetBy(m => metricNames.Contains(m.Name));
            var existingMetricNames = existingMetrics.Select(m => m.Name).ToHashSet();

            var newMetricEntities = metrics
                .Where(m => !existingMetricNames.Contains(m.Name))
                .DistinctBy(m => m.Name)
                .Select(metric => new HealthConnectMetricEntity
                {
                    Name = metric.Name
                })
                .ToList();

            var addedMetrics = new List<HealthConnectMetric>();

            foreach (var metricEntity in newMetricEntities)
            {
                if (await HealthConnectRepository.HealthConnectMetricTable.Insert(metricEntity, m => m.Name == metricEntity.Name))
                {
                    var originalMetric = metrics.First(m => m.Name == metricEntity.Name);
                    addedMetrics.Add(originalMetric);
                }
            }

            if (addedMetrics.Any())
            {
                await HealthConnectRepository.SaveChanges();

                var insertedMetrics = await HealthConnectRepository.HealthConnectMetricTable.GetBy(m => metricNames.Contains(m.Name));

                foreach (var metric in addedMetrics)
                {
                    var insertedMetric = insertedMetrics.FirstOrDefault(m => m.Name == metric.Name);
                    if (insertedMetric != null)
                    {
                        metric.Id = insertedMetric.Id;
                    }
                }
            }

            return addedMetrics.ToHashSet();
        }

        private static HashSet<HealthConnectMetricMapping> MapToModels(IEnumerable<HealthConnectMetricMappingEntity> entities)
        {
            return entities.Select(m => new HealthConnectMetricMapping
            {
                Id = m.Id,
                UserId = m.UserId,
                MetricId = m.MetricId,
                Source = m.Source,
                DisplayName = m.DisplayName,
                IsActive = m.IsActive,
                IsGranted = m.IsGranted
            }).ToHashSet();
        }

        enum HealthConnectMetrics
        {
            // Activity
            StepsRecord = 0,
            DistanceRecord = 1,
            ActiveCaloriesBurnedRecord = 2,
            TotalCaloriesBurnedRecord = 3,

            // Exercise
            ExerciseSessionRecord = 4,

            // Heart
            HeartRateRecord = 5,
            RestingHeartRateRecord = 6,
            HeartRateVariabilityRmssdRecord = 7,

            // Body composition
            HeightRecord = 8,
            WeightRecord = 9,
            BodyFatRecord = 10,
            LeanBodyMassRecord = 11,

            // Sleep
            SleepSessionRecord = 12,

            // Nutrition & Hydration
            HydrationRecord = 13,
            NutritionRecord = 14,

            // Vitals
            BloodPressureRecord = 15,
            BloodGlucoseRecord = 16,
            BodyTemperatureRecord = 17
        }
    }
}
