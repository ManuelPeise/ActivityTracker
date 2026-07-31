using Data.Db.Entities.HealthConnect;
using Logic.Shared.Interfaces;
using Shared.Models.Import.HealthConnect;

namespace Logic.Import.HealthConnect
{
    internal class HealthConnectSourceMapper : AHealthConnectMapper<HealthConnectSourceMapping>
    {
        public HealthConnectSourceMapper(IHealthConnectRepository healthConnectRepository, int userId) 
            : base(healthConnectRepository, userId) { }

        public async Task<HashSet<HealthConnectSourceMapping>> AddMappingsAsync(HashSet<string> sources)
        {
            var addedSources = await AddSourcesAsync(sources);

            if (addedSources.Any())
            {
                var existingMappings = await HealthConnectRepository.HealthConnectSourceMappingTable.GetBy(x => x.UserId == UserId);
                var existingSourceIds = existingMappings.Select(x => x.SourceId).ToHashSet();

                var newMappings = addedSources
                    .Where(source => !existingSourceIds.Contains(source.Id))
                    .Select(source => new HealthConnectSourceMappingEntity
                    {
                        UserId = UserId,
                        SourceId = source.Id,
                        Source = source.Name,
                        DisplayName = string.Empty,
                        IsActive = false,
                    })
                    .ToList();

                foreach (var mapping in newMappings)
                {
                    await HealthConnectRepository.HealthConnectSourceMappingTable.Insert(mapping, x => x.SourceId == mapping.SourceId && x.UserId == UserId);
                }

                if (newMappings.Any())
                {
                    await HealthConnectRepository.SaveChanges();
                    IsDbModified = true;
                }
            }

            return await GetMappingsAsync();
        }

        public override async Task<HashSet<HealthConnectSourceMapping>> GetMappingsAsync()
        {
            var existingMappingEntities = await HealthConnectRepository.HealthConnectSourceMappingTable.GetBy(x => x.UserId == UserId);

            if (!existingMappingEntities.Any())
            {
                return [];
            }

            return MapToModels(existingMappingEntities);
        }

        public override async Task<HashSet<HealthConnectSourceMapping>> UpdateMappingAsync(HashSet<HealthConnectSourceMapping> mappings)
        {
            if (!mappings.Any())
            {
                return [];
            }

            var mappingIds = mappings.Select(m => m.Id).ToHashSet();
            var existingMappingEntities = await HealthConnectRepository.HealthConnectSourceMappingTable.GetBy(x => x.UserId == UserId && mappingIds.Contains(x.Id));

            var existingEntitiesDict = existingMappingEntities.ToDictionary(x => x.Id);

            foreach (var mapping in mappings)
            {
                if (existingEntitiesDict.TryGetValue(mapping.Id, out var existingMapping))
                {
                    existingMapping.DisplayName = mapping.DisplayName;
                    existingMapping.IsActive = mapping.IsActive;

                    await HealthConnectRepository.HealthConnectSourceMappingTable.Update(existingMapping, x => x.Id == mapping.Id);
                    IsDbModified = true;
                }
            }

            if (IsDbModified)
            {
                await HealthConnectRepository.SaveChanges();
            }

            var updatedMappings = await HealthConnectRepository.HealthConnectSourceMappingTable.GetBy(x => x.UserId == UserId);

            return MapToModels(updatedMappings);
        }

        private async Task<HashSet<HealthConnectSource>> AddSourcesAsync(HashSet<string> sources)
        {
            if (!sources.Any())
            {
                return [];
            }

            
            var existingSources = await HealthConnectRepository.HealthConnectSourceTable.GetBy(m => sources.Contains(m.Name));
            var existingSourceNames = existingSources.Select(m => m.Name).ToHashSet();

            var newSourceEntities = sources
                .Where(s => !existingSourceNames.Contains(s))
                .Distinct()
                .Select(source => new HealthConnectSourceEntity
                {
                    Name = source,
                })
                .ToList();

            var addedSources = new List<HealthConnectSource>();

            foreach (var sourceEntity in newSourceEntities)
            {
                if (await HealthConnectRepository.HealthConnectSourceTable.Insert(sourceEntity, m => m.Name == sourceEntity.Name))
                {
                    var originalSource = sources.First(name => name == sourceEntity.Name);
                    addedSources.Add(new HealthConnectSource
                    {
                        Name = originalSource
                    });
                }
            }

            if (addedSources.Any())
            {
                var sourceNames = addedSources.Select(m => m.Name).ToHashSet();
                await HealthConnectRepository.SaveChanges();

                var insertedSources = await HealthConnectRepository.HealthConnectSourceTable.GetBy(s => sourceNames.Contains(s.Name));

                foreach (var source in addedSources)
                {
                    var insertedSource = insertedSources.FirstOrDefault(m => m.Name == source.Name);
                    if (insertedSource != null)
                    {
                        source.Id = insertedSource.Id;
                    }
                }
            }

            return addedSources.ToHashSet();
        }

        private static HashSet<HealthConnectSourceMapping> MapToModels(IEnumerable<HealthConnectSourceMappingEntity> entities)
        {
            return entities.Select(m => new HealthConnectSourceMapping
            {
                Id = m.Id,
                UserId = m.UserId,
                SourceId = m.SourceId,
                Source = m.Source,
                DisplayName = m.DisplayName,
                IsActive = m.IsActive
            }).ToHashSet();
        }
    }
}
