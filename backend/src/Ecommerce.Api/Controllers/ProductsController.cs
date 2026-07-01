using System;
using System.Threading;
using System.Threading.Tasks;
using Ecommerce.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] Guid? categoryId, [FromQuery] string? searchTerm, [FromQuery] bool? featuredOnly, CancellationToken cancellationToken)
    {
        var products = await _productService.GetProductsAsync(categoryId, searchTerm, featuredOnly, cancellationToken);
        return Ok(products);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured([FromQuery] int count = 10, CancellationToken cancellationToken)
    {
        var featured = await _productService.GetFeaturedProductsAsync(count, cancellationToken);
        return Ok(featured);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug, CancellationToken cancellationToken)
    {
        var product = await _productService.GetProductBySlugAsync(slug, cancellationToken);
        if (product == null) return NotFound($"Product with slug '{slug}' was not found.");
        return Ok(product);
    }
}
