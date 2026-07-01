namespace Ecommerce.Domain.Entities;

public class Order
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public string OrderNumber { get; set; } = string.Empty; // e.g., "ORD-2026-1004"
    
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    
    public decimal SubTotal { get; set; }
    
    public decimal ShippingFee { get; set; }
    
    public decimal Tax { get; set; }
    
    public decimal Total { get; set; }
    
    public string Status { get; set; } = "Pending"; // Pending, Processing, Shipped, Delivered, Cancelled
    
    public string PaymentStatus { get; set; } = "Unpaid"; // Unpaid, Paid, Refunded, Failed
    
    public string? PaymentIntentId { get; set; } // Stripe/PayPal payment gateway transaction ID

    // Delivery Address Details at the time of purchase (normalized / snapshotted for audit safety)
    public required string ShippingStreet { get; set; }
    public string? ShippingSuiteOrApartment { get; set; }
    public required string ShippingCity { get; set; }
    public required string ShippingState { get; set; }
    public required string ShippingPostalCode { get; set; }
    public required string ShippingCountry { get; set; }

    // Relationships
    public Guid CustomerId { get; set; }
    public Customer? Customer { get; set; }
    
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
