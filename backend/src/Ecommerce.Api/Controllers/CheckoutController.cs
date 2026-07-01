using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ecommerce.Application.Interfaces;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CheckoutController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public CheckoutController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("start")]
    public async Task<IActionResult> StartCheckout([FromBody] StartCheckoutRequest request, CancellationToken cancellationToken)
    {
        if (request.CartId == Guid.Empty)
        {
            return BadRequest("Invalid CartId.");
        }

        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.Id == request.CartId, cancellationToken);

        if (cart == null)
        {
            return NotFound("Cart was not found.");
        }

        if (!cart.Items.Any())
        {
            return BadRequest("Cannot start checkout on an empty cart.");
        }

        // Calculate checkout metrics
        var totalAmount = cart.Items.Sum(i => i.UnitPriceSnapshot * i.Quantity);
        var totalQuantity = cart.Items.Sum(i => i.Quantity);

        // TODO: Integrate payment gateway (e.g. Stripe Payment Intent creation, Razorpay order creation)
        // var stripeIntent = await _stripeService.CreatePaymentIntentAsync(totalAmount);

        return Ok(new CheckoutSessionResponse
        {
            CartId = cart.Id,
            TotalAmount = totalAmount,
            TotalQuantity = totalQuantity,
            PaymentIntentId = "pi_mock_" + Guid.NewGuid().ToString("N").Substring(0, 16),
            PaymentGatewayName = "MockGateway",
            Message = "Checkout session initialized. Ready for shipping and payment entry."
        });
    }
}

public class StartCheckoutRequest
{
    public Guid CartId { get; set; }
}

public class CheckoutSessionResponse
{
    public Guid CartId { get; set; }
    public decimal TotalAmount { get; set; }
    public int TotalQuantity { get; set; }
    public required string PaymentIntentId { get; set; }
    public required string PaymentGatewayName { get; set; }
    public required string Message { get; set; }
}
