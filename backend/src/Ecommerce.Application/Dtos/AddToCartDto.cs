using System;

namespace Ecommerce.Application.Dtos;

public class AddToCartDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public string? SelectedVariantSummary { get; set; }
}
