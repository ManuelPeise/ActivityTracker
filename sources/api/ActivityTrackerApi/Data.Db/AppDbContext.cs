using Data.Db.Entities.Authentication;
using Data.Db.Entities.HealthConnect;
using Microsoft.EntityFrameworkCore;

namespace Data.Db
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // User
        public DbSet<UserEntity> UserTable { get; set; }
        public DbSet<UserAuthenticationEntity> UserAuthenticationTable { get; set; }

        // HealthConnect
        public DbSet<HealthConnectConfigurationEntity> HealthConnectConfigurationTable { get; set; }
        public DbSet<HealthConnectMetricEntity> HealthConnectMetricTable { get; set; }
        public DbSet<HealthConnectMetricMappingEntity> HealthConnectMetricMappingTable { get; set; }
        public DbSet<HealthConnectSourceEntity> HealthConnectSourceTable { get; set; }
        public DbSet<HealthConnectSourceMappingEntity> HealthConnectSourceMappingTable { get; set; }

        override protected void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<UserEntity>(entity =>
            {
                entity.ToTable("UserTable");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.EmailAddress).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CreatedBy).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CreatedAt).IsRequired();
               
            });

            modelBuilder.Entity<UserAuthenticationEntity>(entity =>
            {
                entity.ToTable("UserAuthenticationTable");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Password).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Salt).IsRequired().HasMaxLength(500);
                entity.Property(e => e.CreatedBy).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CreatedAt).IsRequired();
            });

            modelBuilder.Entity<UserEntity>(entity =>
            {
                entity.HasOne(u => u.UserAuthentication)
                      .WithOne()
                      .HasForeignKey<UserEntity>(u => u.UserAuthenticationId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<HealthConnectConfigurationEntity>(entity =>
            {
                entity.ToTable("HealthConnectConfiguration");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.DeviceId).IsRequired().HasMaxLength(200);
                entity.Property(e => e.DeviceName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Status).IsRequired();
                entity.Property(e => e.IsActive).IsRequired();
                entity.Property(e => e.CreatedBy).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UserId).IsRequired();

                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.HealthConnectSourceMappings)
                      .WithOne()
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.HealthConnectMetricMappings)
                      .WithOne()
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<HealthConnectMetricEntity>(entity =>
            {
                entity.ToTable("HealthConnectMetricTable");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CreatedBy).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CreatedAt).IsRequired();
            });

            modelBuilder.Entity<HealthConnectMetricMappingEntity>(entity =>
            {
                entity.ToTable("HealthConnectMetricMapping");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Source).IsRequired().HasMaxLength(200);
                entity.Property(e => e.DisplayName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.IsGranted).IsRequired();
                entity.Property(e => e.IsActive).IsRequired();
                entity.Property(e => e.CreatedBy).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UserId).IsRequired();
                entity.Property(e => e.MetricId).IsRequired();

                entity.HasOne(e => e.MetricEntity)
                      .WithMany()
                      .HasForeignKey(e => e.MetricId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<HealthConnectSourceEntity>(entity =>
            {
                entity.ToTable("HealthConnectSourceTable");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CreatedBy).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CreatedAt).IsRequired();
            });

            modelBuilder.Entity<HealthConnectSourceMappingEntity>(entity =>
            {
                entity.ToTable("HealthConnectSourceMapping");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Source).IsRequired().HasMaxLength(200);
                entity.Property(e => e.DisplayName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.IsActive).IsRequired();
                entity.Property(e => e.CreatedBy).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UserId).IsRequired();
                entity.Property(e => e.SourceId).IsRequired();

                entity.HasOne(e => e.SourceEntity)
                      .WithMany()
                      .HasForeignKey(e => e.SourceId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
