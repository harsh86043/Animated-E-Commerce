using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Ecommerce.Application.Dtos;

namespace Ecommerce.Application.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetProductsAsync(Guid? categoryId, string? searchTerm, bool? featuredOnly, CancellationToken cancellationToken);
    Task<ProductDetailDto?> GetProductBySlugAsync(string slug, CancellationToken cancellationToken);
    Task<IEnumerable<ProductDto>> GetFeaturedProductsAsync(int count, CancellationToken cancellationToken);
    
    // Admin operations
    Task<ProductDetailDto> CreateProductAsync(CreateProductDto dto, CancellationToken cancellationToken);
    Task<ProductDetailDto?> UpdateProductAsync(Guid id, UpdateProductDto dto, CancellationToken cancellationToken);
    Task<bool> DeleteProductAsync(Guid id, CancellationToken cancellationToken);
}
