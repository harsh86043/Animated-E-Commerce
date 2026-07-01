using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Ecommerce.Application.Interfaces;
using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Enums;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SellerController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<SellerController> _logger;

    public SellerController(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        ILogger<SellerController> logger)
    {
        _context = context;
        _currentUserService = currentUserService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterSeller([FromBody] SellerRegisterRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        // Determine if there is an authenticated user to upgrade or if we create one
        Guid userId;
        User? user = null;

        if (_currentUserService.IsAuthenticated && _currentUserService.CustomerId.HasValue)
        {
            userId = _currentUserService.CustomerId.Value;
            user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        }
        else
        {
            // If not logged in, we check if they provided details to create a user, or return an error.
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.FullName))
            {
                return BadRequest(new { Message = "Please login first or provide Email, Password, and FullName to register." });
            }

            var existingUser = await _context.Users.AnyAsync(u => u.Email == request.Email, cancellationToken);
            if (existingUser) return BadRequest(new { Message = "Email already registered." });

            // Create new User
            user = new User
            {
                Email = request.Email,
                FullName = request.FullName,
                PasswordHash = Convert.ToBase64String(System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(request.Password))),
                Role = UserRole.Seller,
                IsActive = true
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync(cancellationToken);
            userId = user.Id;
        }

        if (user != null && user.Role != UserRole.Admin)
        {
            user.Role = UserRole.Seller; // Upgrade role
        }

        // Check if seller profile already exists
        var existingProfile = await _context.SellerProfiles.AnyAsync(sp => sp.UserId == userId || sp.StoreSlug == request.StoreSlug, cancellationToken);
        if (existingProfile)
        {
            return BadRequest(new { Message = "Store with this store slug or user profile already exists." });
        }

        var profile = new SellerProfile
        {
            UserId = userId,
            StoreName = request.StoreName,
            StoreSlug = request.StoreSlug,
            BusinessEmail = request.BusinessEmail ?? user?.Email ?? "business@temp.com",
            BusinessPhone = request.BusinessPhone ?? user?.PhoneNumber ?? "+1 555-1111",
            Address = request.Address,
            GstNumber = request.GstNumber,
            PanNumber = request.PanNumber,
            Status = SellerStatus.PendingApproval
        };

        _context.SellerProfiles.Add(profile);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("AUDIT: Seller registered. StoreName: {StoreName}, Status: PendingApproval, UserId: {UserId}", profile.StoreName, userId);

        return Ok(new
        {
            Message = "Seller registration submitted successfully. Pending admin approval.",
            Profile = new SellerProfileDto
            {
                Id = profile.Id,
                StoreName = profile.StoreName,
                StoreSlug = profile.StoreSlug,
                BusinessEmail = profile.BusinessEmail,
                BusinessPhone = profile.BusinessPhone,
                Status = profile.Status.ToString(),
                GstNumber = profile.GstNumber,
                PanNumber = profile.PanNumber
            }
        });
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile(CancellationToken cancellationToken)
    {
        // For development robustness, if not logged in, fetch the first seller profile
        Guid? userId = _currentUserService.CustomerId;
        if (!userId.HasValue)
        {
            var demoProfile = await _context.SellerProfiles.FirstOrDefaultAsync(cancellationToken);
            if (demoProfile == null) return NotFound("Seller profile not found.");
            userId = demoProfile.UserId;
        }

        var profile = await _context.SellerProfiles.FirstOrDefaultAsync(sp => sp.UserId == userId.Value, cancellationToken);
        if (profile == null) return NotFound("Seller profile not found.");

        return Ok(new SellerProfileDto
        {
            Id = profile.Id,
            StoreName = profile.StoreName,
            StoreSlug = profile.StoreSlug,
            BusinessEmail = profile.BusinessEmail,
            BusinessPhone = profile.BusinessPhone,
            Status = profile.Status.ToString(),
            Address = profile.Address,
            GstNumber = profile.GstNumber,
            PanNumber = profile.PanNumber
        });
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] SellerProfileUpdateDto dto, CancellationToken cancellationToken)
    {
        Guid? userId = _currentUserService.CustomerId;
        if (!userId.HasValue)
        {
            var demoProfile = await _context.SellerProfiles.FirstOrDefaultAsync(cancellationToken);
            if (demoProfile == null) return Unauthorized();
            userId = demoProfile.UserId;
        }

        var profile = await _context.SellerProfiles.FirstOrDefaultAsync(sp => sp.UserId == userId, cancellationToken);
        if (profile == null) return NotFound("Seller profile not found.");

        profile.StoreName = dto.StoreName;
        profile.BusinessEmail = dto.BusinessEmail;
        profile.BusinessPhone = dto.BusinessPhone;
        profile.Address = dto.Address;
        profile.GstNumber = dto.GstNumber;
        profile.PanNumber = dto.PanNumber;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("AUDIT: Seller profile updated. StoreSlug: {StoreSlug}", profile.StoreSlug);

        return Ok(new SellerProfileDto
        {
            Id = profile.Id,
            StoreName = profile.StoreName,
            StoreSlug = profile.StoreSlug,
            BusinessEmail = profile.BusinessEmail,
            BusinessPhone = profile.BusinessPhone,
            Status = profile.Status.ToString(),
            Address = profile.Address,
            GstNumber = profile.GstNumber,
            PanNumber = profile.PanNumber
        });
    }
}

public class SellerRegisterRequest
{
    public required string StoreName { get; set; }
    public required string StoreSlug { get; set; }
    public string? BusinessEmail { get; set; }
    public string? BusinessPhone { get; set; }
    public string? Address { get; set; }
    public string? GstNumber { get; set; }
    public string? PanNumber { get; set; }

    // Optional user registration details if registering new account
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? FullName { get; set; }
}

public class SellerProfileUpdateDto
{
    public required string StoreName { get; set; }
    public required string BusinessEmail { get; set; }
    public required string BusinessPhone { get; set; }
    public string? Address { get; set; }
    public string? GstNumber { get; set; }
    public string? PanNumber { get; set; }
}

public class SellerProfileDto
{
    public Guid Id { get; set; }
    public required string StoreName { get; set; }
    public required string StoreSlug { get; set; }
    public required string BusinessEmail { get; set; }
    public required string BusinessPhone { get; set; }
    public required string Status { get; set; }
    public string? Address { get; set; }
    public string? GstNumber { get; set; }
    public string? PanNumber { get; set; }
}
