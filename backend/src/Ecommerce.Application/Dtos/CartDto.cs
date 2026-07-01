using System;
using System.Collections.Generic;
using System.Linq;

namespace Ecommerce.Application.Dtos;

public class CartDto
{
    public Guid Id { get; set; }
    public string? SessionId { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
    public decimal TotalAmount => Items.Sum(x => x.TotalPrice);
    public int TotalQuantity => Items.Sum(x => x.Quantity);
}
