namespace Ecommerce.Domain.Entities;

public class Customer
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public required string Email { get; set; }
    
    public required string FirstName { get; set; }
    
    public required string LastName { get; set; }
    
    public string? PhoneNumber { get; set; }
    
    public string? PasswordHash { get; set; } // Secure authentication placeholder
    
    public string Role { get; set; } = "Customer"; // Customer or Admin
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relationships
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public Cart? Cart { get; set; }
}
