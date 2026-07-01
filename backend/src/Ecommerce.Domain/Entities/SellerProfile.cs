using System;
using Ecommerce.Domain.Enums;

namespace Ecommerce.Domain.Entities;

public class SellerProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User? User { get; set; }
    
    public required string StoreName { get; set; }
    public required string StoreSlug { get; set; }
    public required string BusinessEmail { get; set; }
    public required string BusinessPhone { get; set; }
    
    public string? Address { get; set; }
    public string? GstNumber { get; set; }
    public string? PanNumber { get; set; }
    
    public SellerStatus Status { get; set; } = SellerStatus.PendingApproval;
    public DateTime? ApprovedAtUtc { get; set; }
    public Guid? ApprovedByAdminId { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
