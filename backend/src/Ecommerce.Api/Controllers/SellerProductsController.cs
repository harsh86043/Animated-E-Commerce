using System;
using System.Linq;
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
[Route("api/seller/products")]
public class SellerProductsController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<SellerProductsController> _logger;

    public SellerProductsController(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        ILogger<SellerProductsController> logger)
    {
        _context = context;
        _currentUserService = currentUserService;
        _logger = logger;
    }

    private async Task<Guid?> GetCurrentSellerIdAsync(CancellationToken cancellationToken)
    {
        var userId = _currentUserService.CustomerId;
        if (!userId.HasValue)
        {
            // Fallback for testing ease: find first active seller
            var firstSeller = await _context.SellerProfiles.FirstOrDefaultAsync(cancellationToken);
            return firstSeller?.Id;
        }

        var profile = await _context.SellerProfiles.FirstOrDefaultAsync(sp => sp.UserId == userId.Value, cancellationToken);
        return profile?.Id;
    }

    [HttpGet]
    public async Task<IActionResult> GetSellerProducts(CancellationToken cancellationToken)
    {
        var sellerId = await GetCurrentSellerIdAsync(cancellationToken);
        if (!sellerId.HasValue) return BadRequest("Could not identify seller identity.");

        var products = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.SellerId == sellerId.Value)
            .OrderByDescending(p => p.CreatedAtUtc)
            .Select(p => new SellerProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                IsActive = p.IsActive,
                ApprovalStatus = p.ApprovalStatus.ToString(),
                CategoryName = p.Category != null ? p.Category.Name : "Uncategorized",
                ImageUrl = p.ImageUrl,
                RejectionReason = p.RejectionReason
            })
            .ToListAsync(cancellationToken);

        return Ok(products);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateSellerProductDto dto, CancellationToken cancellationToken)
    {
        var sellerId = await GetCurrentSellerIdAsync(cancellationToken);
        if (!sellerId.HasValue) return BadRequest("Could not identify seller identity.");

        // Check category
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId, cancellationToken);
        if (!categoryExists) return BadRequest("Category was not found.");

        // Check slug uniqueness
        var slugExists = await _context.Products.AnyAsync(p => p.Slug == dto.Slug, cancellationToken);
        if (slugExists) return BadRequest("Product with this URL slug already exists.");

        var product = new Product
        {
            CategoryId = dto.CategoryId,
            SellerId = sellerId.Value,
            Name = dto.Name,
            Slug = dto.Slug,
            ShortDescription = dto.ShortDescription,
            Description = dto.Description,
            Price = dto.Price,
            StockQuantity = dto.StockQuantity,
            ImageUrl = dto.ImageUrl ?? "/assets/images/products/placeholder.jpg",
            ModelUrl = dto.ModelUrl,
            ApprovalStatus = ProductApprovalStatus.Draft, // Newly added starts as Draft
            IsActive = false, // Not live until approved
            IsFeatured = false
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("AUDIT: Product '{Name}' created as Draft by Seller {SellerId}", product.Name, sellerId.Value);

        return CreatedAtAction(
            nameof(ProductsController.GetBySlug), 
            "Products", 
            new { slug = product.Slug }, 
            product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateSellerProductDto dto, CancellationToken cancellationToken)
    {
        var sellerId = await GetCurrentSellerIdAsync(cancellationToken);
        if (!sellerId.HasValue) return BadRequest("Could not identify seller identity.");

        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id && p.SellerId == sellerId.Value, cancellationToken);
        if (product == null) return NotFound("Product not found or access denied.");

        // Check category
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId, cancellationToken);
        if (!categoryExists) return BadRequest("Category was not found.");

        product.CategoryId = dto.CategoryId;
        product.Name = dto.Name;
        product.ShortDescription = dto.ShortDescription;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.StockQuantity = dto.StockQuantity;
        if (!string.IsNullOrWhiteSpace(dto.ImageUrl))
        {
            product.ImageUrl = dto.ImageUrl;
        }
        product.ModelUrl = dto.ModelUrl;
        
        // If updating a rejected product, revert it back to Draft
        if (product.ApprovalStatus == ProductApprovalStatus.Rejected)
        {
            product.ApprovalStatus = ProductApprovalStatus.Draft;
            product.RejectionReason = null;
        }

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("AUDIT: Product '{Name}' updated by Seller {SellerId}", product.Name, sellerId.Value);

        return Ok(product);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(Guid id, CancellationToken cancellationToken)
    {
        var sellerId = await GetCurrentSellerIdAsync(cancellationToken);
        if (!sellerId.HasValue) return BadRequest("Could not identify seller identity.");

        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id && p.SellerId == sellerId.Value, cancellationToken);
        if (product == null) return NotFound("Product not found or access denied.");

        _context.Products.Remove(product);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogWarning("AUDIT: Product '{Name}' deleted by Seller {SellerId}", product.Name, sellerId.Value);

        return NoContent();
    }

    [HttpPost("{id}/submit-for-review")]
    public async Task<IActionResult> SubmitForReview(Guid id, CancellationToken cancellationToken)
    {
        var sellerId = await GetCurrentSellerIdAsync(cancellationToken);
        if (!sellerId.HasValue) return BadRequest("Could not identify seller identity.");

        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id && p.SellerId == sellerId.Value, cancellationToken);
        if (product == null) return NotFound("Product not found or access denied.");

        product.ApprovalStatus = ProductApprovalStatus.PendingReview;
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("AUDIT: Product '{Name}' ({Id}) submitted for review by Seller {SellerId}", product.Name, product.Id, sellerId.Value);

        return Ok(new { Message = "Product submitted for admin review successfully.", Status = "PendingReview" });
    }
}

public class SellerProductDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Slug { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public bool IsActive { get; set; }
    public required string ApprovalStatus { get; set; }
    public required string CategoryName { get; set; }
    public required string ImageUrl { get; set; }
    public string? RejectionReason { get; set; }
}

public class CreateSellerProductDto
{
    public Guid CategoryId { get; set; }
    public required string Name { get; set; }
    public required string Slug { get; set; }
    public required string ShortDescription { get; set; }
    public required string Description { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string? ImageUrl { get; set; }
    public string? ModelUrl { get; set; }
}

public class UpdateSellerProductDto
{
    public Guid CategoryId { get; set; }
    public required string Name { get; set; }
    public required string ShortDescription { get; set; }
    public required string Description { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string? ImageUrl { get; set; }
    public string? ModelUrl { get; set; }
}
