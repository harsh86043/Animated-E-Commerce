using System;

namespace Ecommerce.Domain.Entities;

public class Address
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid? CustomerId { get; set; }
    public Customer? Customer { get; set; }
    
    public required string FullName { get; set; }
    
    public required string PhoneNumber { get; set; }
    
    public required string AddressLine1 { get; set; }
    
    public string? AddressLine2 { get; set; }
    
    public required string City { get; set; }
    
    public required string State { get; set; }
    
    public required string PostalCode { get; set; }
    
    public required string Country { get; set; }
    
    public bool IsDefault { get; set; }
    
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
