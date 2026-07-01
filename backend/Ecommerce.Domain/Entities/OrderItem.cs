namespace Ecommerce.Domain.Entities;

public class OrderItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public int Quantity { get; set; }
    
    // Captured price at point-of-sale for auditing and financial safety
    public decimal UnitPrice { get; set; }
    
    public decimal TotalPrice => UnitPrice * Quantity;
    
    public string? SelectedVariants { get; set; }

    // Relationships
    public Guid OrderId { get; set; }
    public Order? Order { get; set; }
    
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
}
