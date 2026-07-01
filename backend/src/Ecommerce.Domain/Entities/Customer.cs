using System;
using System.Collections.Generic;

namespace Ecommerce.Domain.Entities;

public class Customer
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public required string Email { get; set; }
    
    public required string FullName { get; set; }
    
    public string? PhoneNumber { get; set; }
    
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAtUtc { get; set; }
    
    public bool IsActive { get; set; } = true;

    // Relationships
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
