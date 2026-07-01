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

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
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
}

public class UpdateCartItemQuantityRequest
{
    public int Quantity { get; set; }
}
