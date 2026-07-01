using System;

namespace Ecommerce.Domain.Entities;

public class OtpChallenge
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string DestinationType { get; set; } // "Mobile" or "Email"
    public required string Destination { get; set; }
    public required string Purpose { get; set; } // "Login", "Register", "ForgotPassword"
    public required string OtpHash { get; set; }
    public DateTime ExpiresAtUtc { get; set; }
    public int AttemptCount { get; set; }
    public int MaxAttempts { get; set; } = 3;
    public int ResendCount { get; set; }
    public bool IsUsed { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UsedAtUtc { get; set; }
}
