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

public class CartService : ICartService
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeProvider _dateTimeProvider;

    public CartService(IApplicationDbContext context, IDateTimeProvider dateTimeProvider)
    {
        _context = context;
        _dateTimeProvider = dateTimeProvider;
    }

    private static CartDto MapToCartDto(Cart cart)
    {
        return new CartDto
        {
            Id = cart.Id,
            SessionId = cart.SessionId,
            Items = cart.Items.Select(item => new CartItemDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.Product != null ? item.Product.Name : "Unknown",
                ProductSlug = item.Product != null ? item.Product.Slug : "unknown",
                ProductImageUrl = item.Product != null ? item.Product.ImageUrl : string.Empty,
                Quantity = item.Quantity,
                SelectedVariantSummary = item.SelectedVariantSummary,
                UnitPrice = item.UnitPriceSnapshot
            }).ToList()
        };
    }

    public async Task<CartDto> GetOrCreateCartAsync(string? sessionId, Guid? customerId, CancellationToken cancellationToken)
    {
        Cart? cart = null;

        if (customerId.HasValue)
        {
            cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.CustomerId == customerId.Value, cancellationToken);
        }
        else if (!string.IsNullOrWhiteSpace(sessionId))
        {
            cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.SessionId == sessionId, cancellationToken);
        }

        if (cart == null)
        {
            cart = new Cart
            {
                CustomerId = customerId,
                SessionId = sessionId,
                CreatedAtUtc = _dateTimeProvider.UtcNow
            };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync(cancellationToken);
        }

        return MapToCartDto(cart);
    }

    public async Task<CartDto> AddItemToCartAsync(Guid cartId, AddToCartDto dto, CancellationToken cancellationToken)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.Id == cartId, cancellationToken);

        if (cart == null)
        {
            throw new ArgumentException($"Cart with Id {cartId} was not found.");
        }

        var product = await _context.Products.FindAsync(new object[] { dto.ProductId }, cancellationToken);
        if (product == null)
        {
            throw new ArgumentException($"Product with Id {dto.ProductId} was not found.");
        }

        var existingItem = cart.Items.FirstOrDefault(i => 
            i.ProductId == dto.ProductId && 
            i.SelectedVariantSummary == dto.SelectedVariantSummary);

        if (existingItem != null)
        {
            existingItem.Quantity += dto.Quantity;
            existingItem.UpdatedAtUtc = _dateTimeProvider.UtcNow;
        }
        else
        {
            var cartItem = new CartItem
            {
                CartId = cartId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                SelectedVariantSummary = dto.SelectedVariantSummary,
                UnitPriceSnapshot = product.Price,
                CreatedAtUtc = _dateTimeProvider.UtcNow
            };
            cart.Items.Add(cartItem);
        }

        cart.UpdatedAtUtc = _dateTimeProvider.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        // Reload the cart to ensure products are populated for the return value
        var reloadedCart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstAsync(c => c.Id == cartId, cancellationToken);

        return MapToCartDto(reloadedCart);
    }

    public async Task<CartDto> UpdateItemQuantityAsync(Guid cartId, Guid cartItemId, int quantity, CancellationToken cancellationToken)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.Id == cartId, cancellationToken);

        if (cart == null)
        {
            throw new ArgumentException($"Cart with Id {cartId} was not found.");
        }

        var item = cart.Items.FirstOrDefault(i => i.Id == cartItemId);
        if (item != null)
        {
            if (quantity <= 0)
            {
                cart.Items.Remove(item);
            }
            else
            {
                item.Quantity = quantity;
                item.UpdatedAtUtc = _dateTimeProvider.UtcNow;
            }

            cart.UpdatedAtUtc = _dateTimeProvider.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
        }

        // Reload
        var reloadedCart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstAsync(c => c.Id == cartId, cancellationToken);

        return MapToCartDto(reloadedCart);
    }

    public async Task<CartDto> RemoveItemFromCartAsync(Guid cartId, Guid cartItemId, CancellationToken cancellationToken)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.Id == cartId, cancellationToken);

        if (cart == null)
        {
            throw new ArgumentException($"Cart with Id {cartId} was not found.");
        }

        var item = cart.Items.FirstOrDefault(i => i.Id == cartItemId);
        if (item != null)
        {
            cart.Items.Remove(item);
            cart.UpdatedAtUtc = _dateTimeProvider.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
        }

        // Reload
        var reloadedCart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstAsync(c => c.Id == cartId, cancellationToken);

        return MapToCartDto(reloadedCart);
    }

    public async Task<CartDto> ClearCartAsync(Guid cartId, CancellationToken cancellationToken)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.Id == cartId, cancellationToken);

        if (cart != null)
        {
            cart.Items.Clear();
            cart.UpdatedAtUtc = _dateTimeProvider.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
        }

        // Reload empty cart
        var reloadedCart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstAsync(c => c.Id == cartId, cancellationToken);

        return MapToCartDto(reloadedCart);
    }
}
