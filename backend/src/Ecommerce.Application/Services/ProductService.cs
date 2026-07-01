using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ecommerce.Application.Dtos;
using Ecommerce.Application.Interfaces;
using Ecommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Application.Services;

public class ProductService : IProductService
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeProvider _dateTimeProvider;

    public ProductService(IApplicationDbContext context, IDateTimeProvider dateTimeProvider)
    {
        _context = context;
        _dateTimeProvider = dateTimeProvider;
    }

    public async Task<IEnumerable<ProductDto>> GetProductsAsync(Guid? categoryId, string? searchTerm, bool? featuredOnly, CancellationToken cancellationToken)
    {
        var query = _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Where(p => p.IsActive);

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(term) || p.Description.ToLower().Contains(term) || p.ShortDescription.ToLower().Contains(term));
        }

        if (featuredOnly.HasValue && featuredOnly.Value)
        {
            query = query.Where(p => p.IsFeatured);
        }

        return await query
            .OrderByDescending(p => p.CreatedAtUtc)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                CategoryId = p.CategoryId,
                CategoryName = p.Category != null ? p.Category.Name : string.Empty,
                Name = p.Name,
                Slug = p.Slug,
                ShortDescription = p.ShortDescription,
                Price = p.Price,
                DiscountPrice = p.DiscountPrice,
                Rating = p.Rating,
                ReviewCount = p.ReviewCount,
                ImageUrl = p.ImageUrl,
                IsFeatured = p.IsFeatured,
                StockQuantity = p.StockQuantity
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<ProductDetailDto?> GetProductBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive, cancellationToken);

        if (product == null) return null;

        return new ProductDetailDto
        {
            Id = product.Id,
            CategoryId = product.CategoryId,
            CategoryName = product.Category != null ? product.Category.Name : string.Empty,
            CategorySlug = product.Category != null ? product.Category.Slug : string.Empty,
            Name = product.Name,
            Slug = product.Slug,
            ShortDescription = product.ShortDescription,
            Description = product.Description,
            Price = product.Price,
            DiscountPrice = product.DiscountPrice,
            Rating = product.Rating,
            ReviewCount = product.ReviewCount,
            StockQuantity = product.StockQuantity,
            ImageUrl = product.ImageUrl,
            ModelUrl = product.ModelUrl,
            IsFeatured = product.IsFeatured,
            Images = product.Images
                .OrderBy(img => img.SortOrder)
                .Select(img => new ProductImageDto
                {
                    Id = img.Id,
                    Url = img.Url,
                    AltText = img.AltText,
                    SortOrder = img.SortOrder,
                    IsPrimary = img.IsPrimary
                }).ToList(),
            Variants = product.Variants
                .Where(v => v.IsActive)
                .Select(v => new ProductVariantDto
                {
                    Id = v.Id,
                    Name = v.Name,
                    Value = v.Value,
                    AdditionalPrice = v.AdditionalPrice,
                    StockQuantity = v.StockQuantity
                }).ToList()
        };
    }

    public async Task<IEnumerable<ProductDto>> GetFeaturedProductsAsync(int count, CancellationToken cancellationToken)
    {
        return await _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Where(p => p.IsActive && p.IsFeatured)
            .Take(count)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                CategoryId = p.CategoryId,
                CategoryName = p.Category != null ? p.Category.Name : string.Empty,
                Name = p.Name,
                Slug = p.Slug,
                ShortDescription = p.ShortDescription,
                Price = p.Price,
                DiscountPrice = p.DiscountPrice,
                Rating = p.Rating,
                ReviewCount = p.ReviewCount,
                ImageUrl = p.ImageUrl,
                IsFeatured = p.IsFeatured,
                StockQuantity = p.StockQuantity
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<ProductDetailDto> CreateProductAsync(CreateProductDto dto, CancellationToken cancellationToken)
    {
        var category = await _context.Categories.FindAsync(new object[] { dto.CategoryId }, cancellationToken);
        if (category == null)
        {
            throw new ArgumentException($"Category with Id {dto.CategoryId} does not exist.");
        }

        var product = new Product
        {
            CategoryId = dto.CategoryId,
            Name = dto.Name,
            Slug = dto.Slug,
            ShortDescription = dto.ShortDescription,
            Description = dto.Description,
            Price = dto.Price,
            DiscountPrice = dto.DiscountPrice,
            StockQuantity = dto.StockQuantity,
            ImageUrl = dto.ImageUrl,
            ModelUrl = dto.ModelUrl,
            IsFeatured = dto.IsFeatured,
            CreatedAtUtc = _dateTimeProvider.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync(cancellationToken);

        return new ProductDetailDto
        {
            Id = product.Id,
            CategoryId = product.CategoryId,
            CategoryName = category.Name,
            CategorySlug = category.Slug,
            Name = product.Name,
            Slug = product.Slug,
            ShortDescription = product.ShortDescription,
            Description = product.Description,
            Price = product.Price,
            DiscountPrice = product.DiscountPrice,
            Rating = product.Rating,
            ReviewCount = product.ReviewCount,
            StockQuantity = product.StockQuantity,
            ImageUrl = product.ImageUrl,
            ModelUrl = product.ModelUrl,
            IsFeatured = product.IsFeatured
        };
    }

    public async Task<ProductDetailDto?> UpdateProductAsync(Guid id, UpdateProductDto dto, CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (product == null) return null;

        var category = await _context.Categories.FindAsync(new object[] { dto.CategoryId }, cancellationToken);
        if (category == null)
        {
            throw new ArgumentException($"Category with Id {dto.CategoryId} does not exist.");
        }

        product.CategoryId = dto.CategoryId;
        product.Name = dto.Name;
        product.Slug = dto.Slug;
        product.ShortDescription = dto.ShortDescription;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.DiscountPrice = dto.DiscountPrice;
        product.StockQuantity = dto.StockQuantity;
        product.ImageUrl = dto.ImageUrl;
        product.ModelUrl = dto.ModelUrl;
        product.IsFeatured = dto.IsFeatured;
        product.IsActive = dto.IsActive;
        product.UpdatedAtUtc = _dateTimeProvider.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return new ProductDetailDto
        {
            Id = product.Id,
            CategoryId = product.CategoryId,
            CategoryName = category.Name,
            CategorySlug = category.Slug,
            Name = product.Name,
            Slug = product.Slug,
            ShortDescription = product.ShortDescription,
            Description = product.Description,
            Price = product.Price,
            DiscountPrice = product.DiscountPrice,
            Rating = product.Rating,
            ReviewCount = product.ReviewCount,
            StockQuantity = product.StockQuantity,
            ImageUrl = product.ImageUrl,
            ModelUrl = product.ModelUrl,
            IsFeatured = product.IsFeatured,
            Images = product.Images
                .OrderBy(img => img.SortOrder)
                .Select(img => new ProductImageDto
                {
                    Id = img.Id,
                    Url = img.Url,
                    AltText = img.AltText,
                    SortOrder = img.SortOrder,
                    IsPrimary = img.IsPrimary
                }).ToList(),
            Variants = product.Variants
                .Where(v => v.IsActive)
                .Select(v => new ProductVariantDto
                {
                    Id = v.Id,
                    Name = v.Name,
                    Value = v.Value,
                    AdditionalPrice = v.AdditionalPrice,
                    StockQuantity = v.StockQuantity
                }).ToList()
        };
    }

    public async Task<bool> DeleteProductAsync(Guid id, CancellationToken cancellationToken)
    {
        var product = await _context.Products.FindAsync(new object[] { id }, cancellationToken);
        if (product == null) return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
