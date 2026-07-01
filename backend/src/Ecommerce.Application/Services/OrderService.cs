using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ecommerce.Application.Dtos;
using Ecommerce.Application.Interfaces;
using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Application.Services;

public class OrderService : IOrderService
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeProvider _dateTimeProvider;

    public OrderService(IApplicationDbContext context, IDateTimeProvider dateTimeProvider)
    {
        _context = context;
        _dateTimeProvider = dateTimeProvider;
    }

    private static OrderDto MapToOrderDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            CustomerEmail = order.Customer != null ? order.Customer.Email : order.GuestEmail,
            Status = order.Status.ToString(),
            PaymentStatus = order.PaymentStatus.ToString(),
            TotalAmount = order.TotalAmount,
            ShippingAddressSummary = order.ShippingAddress != null 
                ? $"{order.ShippingAddress.FullName}, {order.ShippingAddress.AddressLine1}, {order.ShippingAddress.City}, {order.ShippingAddress.State} {order.ShippingAddress.PostalCode}, {order.ShippingAddress.Country}"
                : "No address registered",
            CreatedAtUtc = order.CreatedAtUtc,
            Items = order.Items.Select(item => new OrderLineItemDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.Product != null ? item.Product.Name : "Unknown Product",
                ProductSlug = item.Product != null ? item.Product.Slug : "unknown-product",
                ProductImageUrl = item.Product != null ? item.Product.ImageUrl : string.Empty,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                SelectedVariantSummary = item.SelectedVariantSummary
            }).ToList()
        };
    }

    public async Task<CheckoutResultDto> CheckoutAsync(CreateOrderDto dto, CancellationToken cancellationToken)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.Id == dto.CartId, cancellationToken);

        if (cart == null || !cart.Items.Any())
        {
            return new CheckoutResultDto
            {
                Success = false,
                Message = "Your shopping cart is empty or does not exist."
            };
        }

        // Verify and adjust stock
        foreach (var item in cart.Items)
        {
            if (item.Product == null)
            {
                return new CheckoutResultDto
                {
                    Success = false,
                    Message = "One of the items in your cart is no longer available."
                };
            }

            if (item.Product.StockQuantity < item.Quantity)
            {
                return new CheckoutResultDto
                {
                    Success = false,
                    Message = $"Insufficient stock for product '{item.Product.Name}'. Available stock: {item.Product.StockQuantity}"
                };
            }
        }

        // Create Address entity
        var address = new Address
        {
            CustomerId = cart.CustomerId,
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber,
            AddressLine1 = dto.AddressLine1,
            AddressLine2 = dto.AddressLine2,
            City = dto.City,
            State = dto.State,
            PostalCode = dto.PostalCode,
            Country = dto.Country,
            IsDefault = false,
            CreatedAtUtc = _dateTimeProvider.UtcNow
        };
        _context.Addresses.Add(address);

        // Deduct stocks
        foreach (var item in cart.Items)
        {
            item.Product!.StockQuantity -= item.Quantity;
        }

        // Generate Order Number
        var random = new Random();
        var orderNumber = $"ORD-{_dateTimeProvider.UtcNow:yyyyMMdd}-{random.Next(1000, 9999)}";

        // Create Order
        var order = new Order
        {
            OrderNumber = orderNumber,
            CustomerId = cart.CustomerId,
            GuestEmail = cart.CustomerId == null ? dto.GuestEmail ?? "guest@example.com" : null,
            Status = OrderStatus.Pending,
            PaymentStatus = PaymentStatus.Pending,
            ShippingAddress = address,
            CreatedAtUtc = _dateTimeProvider.UtcNow,
            TotalAmount = cart.Items.Sum(item => item.Quantity * item.UnitPriceSnapshot)
        };

        foreach (var cartItem in cart.Items)
        {
            var orderItem = new OrderItem
            {
                ProductId = cartItem.ProductId,
                Quantity = cartItem.Quantity,
                UnitPrice = cartItem.UnitPriceSnapshot,
                SelectedVariantSummary = cartItem.SelectedVariantSummary
            };
            order.Items.Add(orderItem);
        }

        _context.Orders.Add(order);

        // Clear Cart
        _context.CartItems.RemoveRange(cart.Items);
        _context.Carts.Remove(cart);

        await _context.SaveChangesAsync(cancellationToken);

        return new CheckoutResultDto
        {
            Success = true,
            Message = "Checkout completed successfully.",
            OrderId = order.Id,
            OrderNumber = order.OrderNumber
        };
    }

    public async Task<OrderDto?> GetOrderByIdAsync(Guid orderId, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.ShippingAddress)
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);

        if (order == null) return null;

        return MapToOrderDto(order);
    }

    public async Task<OrderDto?> GetOrderByNumberAsync(string orderNumber, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.ShippingAddress)
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber, cancellationToken);

        if (order == null) return null;

        return MapToOrderDto(order);
    }

    public async Task<IEnumerable<OrderDto>> GetCustomerOrdersAsync(Guid customerId, CancellationToken cancellationToken)
    {
        var orders = await _context.Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.ShippingAddress)
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .Where(o => o.CustomerId == customerId)
            .OrderByDescending(o => o.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return orders.Select(MapToOrderDto).ToList();
    }
}
