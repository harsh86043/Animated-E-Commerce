namespace Ecommerce.Domain.Entities;

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public required string Name { get; set; }
    
    public required string Slug { get; set; }
    
    public required string Description { get; set; }
    
    public decimal Price { get; set; }
    
    public decimal? DiscountPrice { get; set; }
    
    public double Rating { get; set; }
    
    public int Stock { get; set; }
    
    public bool IsFeatured { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public string? ModelUrl { get; set; } // Lazy-loaded Three.js 3D model URL
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }

    // Relationships
    public Guid CategoryId { get; set; }
    public Category? Category { get; set; }
    
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
}
