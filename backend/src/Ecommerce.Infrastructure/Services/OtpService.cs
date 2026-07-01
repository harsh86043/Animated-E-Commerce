using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ecommerce.Application.Interfaces;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Services;

public class OtpService : IOtpService
{
    private readonly IApplicationDbContext _context;
    private readonly ISmsSender _smsSender;
    private readonly IEmailSender _emailSender;

    public OtpService(IApplicationDbContext context, ISmsSender smsSender, IEmailSender emailSender)
    {
        _context = context;
        _smsSender = smsSender;
        _emailSender = emailSender;
    }

    public async Task<string> GenerateOtpAsync(string destination, string destinationType, string purpose, CancellationToken cancellationToken = default)
    {
        // 1. Check existing attempts to enforce resend limits / rate limits within last 5 minutes
        var count = await _context.OtpChallenges
            .CountAsync(oc => oc.Destination == destination && oc.Purpose == purpose && oc.CreatedAtUtc > DateTime.UtcNow.AddMinutes(-5), cancellationToken);

        if (count >= 5)
        {
            throw new InvalidOperationException("Too many OTP requests. Please try again after some time.");
        }

        // 2. Generate a secure 6-digit OTP
        var randomBytes = new byte[4];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }
        var otpValue = (Math.Abs(BitConverter.ToInt32(randomBytes, 0)) % 900000 + 100000).ToString();

        // 3. Hash the OTP for secure storage
        var otpHash = HashOtp(otpValue);

        // 4. Create and save challenge
        var challenge = new OtpChallenge
        {
            Destination = destination,
            DestinationType = destinationType,
            Purpose = purpose,
            OtpHash = otpHash,
            ExpiresAtUtc = DateTime.UtcNow.AddMinutes(5),
            AttemptCount = 0,
            MaxAttempts = 3,
            IsUsed = false
        };

        _context.OtpChallenges.Add(challenge);
        await _context.SaveChangesAsync(cancellationToken);

        // 5. Dispatch
        if (destinationType.Equals("Mobile", StringComparison.OrdinalIgnoreCase))
        {
            await _smsSender.SendSmsAsync(destination, $"Your OTP code is {otpValue}. This code expires in 5 minutes.", cancellationToken);
        }
        else
        {
            await _emailSender.SendEmailAsync(destination, "Your E-Commerce Verification OTP", $"Your secure OTP is: <b>{otpValue}</b>. Valid for 5 minutes.", cancellationToken);
        }

        return otpValue;
    }

    public async Task<bool> VerifyOtpAsync(string destination, string otp, string purpose, CancellationToken cancellationToken = default)
    {
        var challenge = await _context.OtpChallenges
            .FirstOrDefaultAsync(oc => oc.Destination == destination && oc.Purpose == purpose && !oc.IsUsed && oc.ExpiresAtUtc > DateTime.UtcNow, cancellationToken);

        if (challenge == null)
        {
            return false;
        }

        if (challenge.AttemptCount >= challenge.MaxAttempts)
        {
            challenge.IsUsed = true; // Lock the challenge
            await _context.SaveChangesAsync(cancellationToken);
            return false;
        }

        challenge.AttemptCount++;

        var inputHash = HashOtp(otp);
        if (challenge.OtpHash == inputHash)
        {
            challenge.IsUsed = true;
            challenge.UsedAtUtc = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return false;
    }

    private string HashOtp(string otp)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(otp));
        return Convert.ToBase64String(hashedBytes);
    }
}
