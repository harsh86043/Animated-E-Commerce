using System;

namespace Ecommerce.Domain.Entities;

public class ProductImage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
    
    public required string Url { get; set; }
    
    public string? AltText { get; set; }
    
    public int SortOrder { get; set; }
    
    public bool IsPrimary { get; set; }
}
