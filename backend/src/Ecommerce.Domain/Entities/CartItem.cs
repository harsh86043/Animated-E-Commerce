using System;

namespace Ecommerce.Domain.Entities;

public class CartItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid CartId { get; set; }
    public Cart? Cart { get; set; }
    
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
    
    public int Quantity { get; set; }
    
    public string? SelectedVariantSummary { get; set; }
    
    public decimal UnitPriceSnapshot { get; set; }
    
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAtUtc { get; set; }
}
