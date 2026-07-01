namespace Ecommerce.Domain.Entities;

public class Address
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public required string Street { get; set; }
    
    public string? SuiteOrApartment { get; set; }
    
    public required string City { get; set; }
    
    public required string State { get; set; }
    
    public required string PostalCode { get; set; }
    
    public required string Country { get; set; }
    
    public bool IsDefaultShipping { get; set; } = false;
    
    public bool IsDefaultBilling { get; set; } = false;

    // Relationships
    public Guid CustomerId { get; set; }
    public Customer? Customer { get; set; }
}
