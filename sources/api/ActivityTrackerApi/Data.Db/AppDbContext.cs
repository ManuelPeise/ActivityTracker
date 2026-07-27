using Data.Db.Entities.Authentication;
using Data.Db.Entities.Import;
using Microsoft.EntityFrameworkCore;

namespace Data.Db
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<UserEntity> UserTable { get; set; }
        public DbSet<UserAuthenticationEntity> UserAuthenticationTable { get; set; }
        public DbSet<DataSyncConnectionEntity> DataSyncConnectionTable { get; set; }
        public DbSet<ImportConfigurationEntity> ImportConfigurationTable { get; set; }

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

            modelBuilder.Entity<DataSyncConnectionEntity>(entity =>
            {
                entity.ToTable("DataSyncConnectionTable");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.DevideId).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CreatedBy).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CreatedAt).IsRequired();
            });

            modelBuilder.Entity<UserEntity>(entity =>
            {
                entity.HasOne(u => u.UserAuthentication)
                      .WithOne()
                      .HasForeignKey<UserEntity>(u => u.UserAuthenticationId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(u => u.UserDataSync)
                      .WithOne()
                      .HasForeignKey<UserEntity>(u => u.UserDataSyncId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
