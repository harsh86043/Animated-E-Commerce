using System;

namespace Ecommerce.Domain.Entities;

public class LoginAudit
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? UserId { get; set; }
    public required string Email { get; set; }
    public string? IpAddress { get; set; }
    public bool Success { get; set; }
    public DateTime TimestampUtc { get; set; } = DateTime.UtcNow;
    public string? FailureReason { get; set; }
}
