namespace Ecommerce.Domain.Entities;

public class Cart
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // For anonymous users, we track by sessionId. For logged-in users, we track by CustomerId.
    public string? SessionId { get; set; }
    
    public Guid? CustomerId { get; set; }
    public Customer? Customer { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Relationships
    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}
