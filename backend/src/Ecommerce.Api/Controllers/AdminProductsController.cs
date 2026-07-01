using System;
using System.Threading;
using System.Threading.Tasks;
using Ecommerce.Application.Dtos;
using Ecommerce.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/admin/products")]
public class AdminProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public AdminProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto, CancellationToken cancellationToken)
    {
        var product = await _productService.CreateProductAsync(dto, cancellationToken);
        return CreatedAtAction(
            nameof(ProductsController.GetBySlug), 
            "Products", 
            new { slug = product.Slug }, 
            product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductDto dto, CancellationToken cancellationToken)
    {
        var product = await _productService.UpdateProductAsync(id, dto, cancellationToken);
        if (product == null) return NotFound($"Product with ID {id} was not found.");
        return Ok(product);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var success = await _productService.DeleteProductAsync(id, cancellationToken);
        if (!success) return NotFound($"Product with ID {id} was not found.");
        return NoContent();
    }
}
