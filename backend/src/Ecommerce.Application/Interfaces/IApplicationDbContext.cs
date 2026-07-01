using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Category> Categories { get; }
    DbSet<Product> Products { get; }
    DbSet<ProductImage> ProductImages { get; }
    DbSet<ProductVariant> ProductVariants { get; }
    DbSet<Customer> Customers { get; }
    DbSet<Address> Addresses { get; }
    DbSet<Cart> Carts { get; }
    DbSet<CartItem> CartItems { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<User> Users { get; }
    DbSet<OtpChallenge> OtpChallenges { get; }
    DbSet<LoginAudit> LoginAudits { get; }
    DbSet<SellerProfile> SellerProfiles { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
