namespace Ecommerce.Domain.Entities;

public class Category
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public required string Name { get; set; }
    
    public required string Slug { get; set; }
    
    public string? Description { get; set; }
    
    public string? ImageUrl { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relationships
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
