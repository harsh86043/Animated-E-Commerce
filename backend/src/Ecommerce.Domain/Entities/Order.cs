using System;
using System.Collections.Generic;
using Ecommerce.Domain.Enums;

namespace Ecommerce.Domain.Entities;

public class Order
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public required string OrderNumber { get; set; }
    
    public Guid? CustomerId { get; set; }
    public Customer? Customer { get; set; }
    
    public string? GuestEmail { get; set; }
    
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    public decimal TotalAmount { get; set; }
    
    public Guid ShippingAddressId { get; set; }
    public Address? ShippingAddress { get; set; }
    
    public Guid? BillingAddressId { get; set; }
    public Address? BillingAddress { get; set; }
    
    public string? PaymentIntentId { get; set; }
    
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAtUtc { get; set; }

    // Relationships
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
