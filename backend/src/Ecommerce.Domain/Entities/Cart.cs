using System;
using System.Collections.Generic;

namespace Ecommerce.Domain.Entities;

public class Cart
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid? CustomerId { get; set; }
    public Customer? Customer { get; set; }
    
    public string? SessionId { get; set; }
    
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAtUtc { get; set; }

    // Relationships
    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}
