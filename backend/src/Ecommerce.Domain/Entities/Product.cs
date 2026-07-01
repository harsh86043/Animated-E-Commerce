using System;
using System.Collections.Generic;
using Ecommerce.Domain.Enums;

namespace Ecommerce.Domain.Entities;

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid CategoryId { get; set; }
    public Category? Category { get; set; }
    
    public required string Name { get; set; }
    
    public required string Slug { get; set; }
    
    public required string ShortDescription { get; set; }
    
    public required string Description { get; set; }
    
    public decimal Price { get; set; }
    
    public decimal? DiscountPrice { get; set; }
    
    public double Rating { get; set; }
    
    public int ReviewCount { get; set; }
    
    public int StockQuantity { get; set; }
    
    public bool IsFeatured { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public required string ImageUrl { get; set; }
    
    public string? ModelUrl { get; set; } // Three.js 3D model path/identifier (lazy loaded)
    
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAtUtc { get; set; }

    // Seller & Moderation properties
    public Guid? SellerId { get; set; }
    public SellerProfile? Seller { get; set; }
    public ProductApprovalStatus ApprovalStatus { get; set; } = ProductApprovalStatus.Approved; // Default to Approved so seeded products are visible
    public string? RejectionReason { get; set; }
    public Guid? ApprovedByAdminId { get; set; }

    // Relationships
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
}
