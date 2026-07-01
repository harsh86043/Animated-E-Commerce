using System;
using System.Collections.Generic;

namespace Ecommerce.Application.Dtos;

public class OrderDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string? CustomerEmail { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string ShippingAddressSummary { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public List<OrderLineItemDto> Items { get; set; } = new();
}
