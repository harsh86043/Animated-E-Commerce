using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Ecommerce.Application.Dtos;

namespace Ecommerce.Application.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllActiveAsync(CancellationToken cancellationToken);
    Task<CategoryDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken);
}
