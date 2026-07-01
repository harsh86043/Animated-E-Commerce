using Microsoft.EntityFrameworkCore;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Data;

public class EcommerceDbContext : DbContext
{
    public EcommerceDbContext(DbContextOptions<EcommerceDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Product Configuration
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
            entity.Property(p => p.Slug).IsRequired().HasMaxLength(250);
            entity.Property(p => p.Description).IsRequired().HasMaxLength(2000);
            entity.Property(p => p.Price).HasPrecision(18, 2);
            entity.Property(p => p.DiscountPrice).HasPrecision(18, 2);
            
            // Indexes
            entity.HasIndex(p => p.Slug).IsUnique();
            entity.HasIndex(p => p.CategoryId);
            entity.HasIndex(p => p.IsActive);
            entity.HasIndex(p => p.IsFeatured);
            entity.HasIndex(p => p.CreatedAt);
        });

        // Category Configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
            entity.Property(c => c.Slug).IsRequired().HasMaxLength(150);
            entity.Property(c => c.Description).HasMaxLength(500);

            entity.HasIndex(c => c.Slug).IsUnique();
        });

        // ProductImage Configuration
        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.HasKey(pi => pi.Id);
            entity.Property(pi => pi.Url).IsRequired().HasMaxLength(1000);
            entity.Property(pi => pi.AltText).HasMaxLength(250);
        });

        // ProductVariant Configuration
        modelBuilder.Entity<ProductVariant>(entity =>
        {
            entity.HasKey(pv => pv.Id);
            entity.Property(pv => pv.Name).IsRequired().HasMaxLength(50);
            entity.Property(pv => pv.Value).IsRequired().HasMaxLength(100);
            entity.Property(pv => pv.PriceAdjustment).HasPrecision(18, 2);
        });

        // Customer Configuration
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Email).IsRequired().HasMaxLength(150);
            entity.Property(c => c.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(c => c.LastName).IsRequired().HasMaxLength(100);
            entity.Property(c => c.Role).HasMaxLength(30);

            entity.HasIndex(c => c.Email).IsUnique();
        });

        // Address Configuration
        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.Street).IsRequired().HasMaxLength(250);
            entity.Property(a => a.City).IsRequired().HasMaxLength(100);
            entity.Property(a => a.State).IsRequired().HasMaxLength(100);
            entity.Property(a => a.PostalCode).IsRequired().HasMaxLength(20);
            entity.Property(a => a.Country).IsRequired().HasMaxLength(100);
        });

        // Cart Configuration
        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.SessionId).HasMaxLength(200);

            entity.HasIndex(c => c.SessionId);
            entity.HasIndex(c => c.CustomerId);
        });

        // Order Configuration
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(o => o.Id);
            entity.Property(o => o.OrderNumber).IsRequired().HasMaxLength(50);
            entity.Property(o => o.SubTotal).HasPrecision(18, 2);
            entity.Property(o => o.ShippingFee).HasPrecision(18, 2);
            entity.Property(o => o.Tax).HasPrecision(18, 2);
            entity.Property(o => o.Total).HasPrecision(18, 2);
            entity.Property(o => o.Status).HasMaxLength(50);
            entity.Property(o => o.PaymentStatus).HasMaxLength(50);
            entity.Property(o => o.PaymentIntentId).HasMaxLength(200);
            
            // Snapshot address configuration
            entity.Property(o => o.ShippingStreet).IsRequired().HasMaxLength(250);
            entity.Property(o => o.ShippingCity).IsRequired().HasMaxLength(100);
            entity.Property(o => o.ShippingState).IsRequired().HasMaxLength(100);
            entity.Property(o => o.ShippingPostalCode).IsRequired().HasMaxLength(20);
            entity.Property(o => o.ShippingCountry).IsRequired().HasMaxLength(100);

            entity.HasIndex(o => o.OrderNumber).IsUnique();
            entity.HasIndex(o => o.CustomerId);
        });

        // OrderItem Configuration
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(oi => oi.Id);
            entity.Property(oi => oi.UnitPrice).HasPrecision(18, 2);
        });
    }
}
