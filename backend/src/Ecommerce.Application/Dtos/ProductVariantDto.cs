using System;

namespace Ecommerce.Application.Dtos;

public class ProductVariantDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public decimal AdditionalPrice { get; set; }
    public int StockQuantity { get; set; }
}
