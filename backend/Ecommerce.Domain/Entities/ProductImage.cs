namespace Ecommerce.Domain.Entities;

public class ProductImage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public required string Url { get; set; }
    
    public string? AltText { get; set; }
    
    public int SortOrder { get; set; } = 0;
    
    public bool IsPrimary { get; set; } = false;

    // Relationships
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
}
