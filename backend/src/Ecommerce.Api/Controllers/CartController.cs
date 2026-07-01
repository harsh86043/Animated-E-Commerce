using System;
using System.Threading;
using System.Threading.Tasks;
using Ecommerce.Application.Dtos;
using Ecommerce.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;
    private readonly IApplicationDbContext _context;

    public CartController(ICartService cartService, IApplicationDbContext context)
    {
        _cartService = cartService;
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetOrCreateCart([FromQuery] string? sessionId, [FromQuery] Guid? customerId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(sessionId) && !customerId.HasValue)
        {
            return BadRequest("Either sessionId or customerId must be provided.");
        }

        var cart = await _cartService.GetOrCreateCartAsync(sessionId, customerId, cancellationToken);
        return Ok(cart);
    }

    [HttpPost("{cartId}/items")]
    public async Task<IActionResult> AddItem(Guid cartId, [FromBody] AddToCartDto dto, CancellationToken cancellationToken)
    {
        if (dto.Quantity <= 0)
        {
            return BadRequest("Quantity must be greater than zero.");
        }

        var cart = await _cartService.AddItemToCartAsync(cartId, dto, cancellationToken);
        return Ok(cart);
    }

    [HttpPut("{cartId}/items/{cartItemId}")]
    public async Task<IActionResult> UpdateItem(Guid cartId, Guid cartItemId, [FromBody] UpdateCartItemQuantityRequest request, CancellationToken cancellationToken)
    {
        var cart = await _cartService.UpdateItemQuantityAsync(cartId, cartItemId, request.Quantity, cancellationToken);
        return Ok(cart);
    }

    [HttpDelete("{cartId}/items/{cartItemId}")]
    public async Task<IActionResult> RemoveItem(Guid cartId, Guid cartItemId, CancellationToken cancellationToken)
    {
        var cart = await _cartService.RemoveItemFromCartAsync(cartId, cartItemId, cancellationToken);
        return Ok(cart);
    }

    [HttpDelete("{cartId}/clear")]
    public async Task<IActionResult> Clear(Guid cartId, CancellationToken cancellationToken)
    {
        var cart = await _cartService.ClearCartAsync(cartId, cancellationToken);
        return Ok(cart);
    }

    [HttpPost("merge-guest-cart")]
    public async Task<IActionResult> MergeGuestCart([FromBody] MergeCartRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.GuestSessionId))
        {
            return BadRequest("GuestSessionId is required.");
        }

        // Get or Create customer cart
        var customerCartDto = await _cartService.GetOrCreateCartAsync(null, request.CustomerId, cancellationToken);

        // Fetch guest cart using EF Context to grab its raw items
        var guestCart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.SessionId == request.GuestSessionId, cancellationToken);

        if (guestCart != null && guestCart.Items.Any())
        {
            foreach (var guestItem in guestCart.Items)
            {
                var addToCartDto = new AddToCartDto
                {
                    ProductId = guestItem.ProductId,
                    Quantity = guestItem.Quantity,
                    SelectedVariantSummary = guestItem.SelectedVariantSummary
                };
                customerCartDto = await _cartService.AddItemToCartAsync(customerCartDto.Id, addToCartDto, cancellationToken);
            }

            // Clear guest cart
            guestCart.Items.Clear();
            await _context.SaveChangesAsync(cancellationToken);
        }

        return Ok(customerCartDto);
    }
}

public class UpdateCartItemQuantityRequest
{
    public int Quantity { get; set; }
}

public class MergeCartRequest
{
    public required string GuestSessionId { get; set; }
    public Guid CustomerId { get; set; }
}
