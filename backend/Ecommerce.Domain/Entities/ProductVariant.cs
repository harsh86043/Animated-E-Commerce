namespace Ecommerce.Domain.Entities;

public class ProductVariant
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public required string Name { get; set; } // e.g., "Size", "Color"
    
    public required string Value { get; set; } // e.g., "XL", "Midnight Blue"
    
    public decimal? PriceAdjustment { get; set; } // Extra charge if this variant is selected
    
    public int Stock { get; set; }

    // Relationships
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
}
