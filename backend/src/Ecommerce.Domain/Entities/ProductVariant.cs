using System;

namespace Ecommerce.Domain.Entities;

public class ProductVariant
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
    
    public required string Name { get; set; }
    
    public required string Value { get; set; }
    
    public decimal AdditionalPrice { get; set; }
    
    public int StockQuantity { get; set; }
    
    public bool IsActive { get; set; } = true;
}
