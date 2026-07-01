using System;

namespace Ecommerce.Application.Dtos;

public class CreateOrderDto
{
    public string? GuestEmail { get; set; }
    
    // Shipping Address
    public required string FullName { get; set; }
    public required string PhoneNumber { get; set; }
    public required string AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public required string City { get; set; }
    public required string State { get; set; }
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
    
    public Guid CartId { get; set; }
}
