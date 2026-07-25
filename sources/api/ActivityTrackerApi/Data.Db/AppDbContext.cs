using Data.Db.Entities.Authentication;
using Microsoft.EntityFrameworkCore;

namespace Data.Db
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<UserEntity> UserTable { get; set; }
        public DbSet<UserAuthenticationEntity> UserAuthenticationTable { get; set; }
        public DbSet<DataSyncConnectionEntity> DataSyncConnectionTable { get; set; }
        
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

                entity.HasOne<UserEntity>()
                      .WithOne()
                      .HasForeignKey<UserAuthenticationEntity>(e => e.Id)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<DataSyncConnectionEntity>(entity =>
            {
                entity.ToTable("DataSyncConnectionTable");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.DevideId).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CreatedBy).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CreatedAt).IsRequired();

                entity.HasOne<UserEntity>()
                      .WithOne()
                      .HasForeignKey<DataSyncConnectionEntity>(e => e.Id)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
