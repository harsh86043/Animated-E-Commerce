using System;

namespace Ecommerce.Application.Dtos;

public class CreateProductDto
{
    public Guid CategoryId { get; set; }
    public required string Name { get; set; }
    public required string Slug { get; set; }
    public required string ShortDescription { get; set; }
    public required string Description { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int StockQuantity { get; set; }
    public required string ImageUrl { get; set; }
    public string? ModelUrl { get; set; }
    public bool IsFeatured { get; set; }
}
