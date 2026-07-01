using System;
using System.Threading;
using System.Threading.Tasks;
using Ecommerce.Application.Dtos;

namespace Ecommerce.Application.Interfaces;

public interface ICartService
{
    Task<CartDto> GetOrCreateCartAsync(string? sessionId, Guid? customerId, CancellationToken cancellationToken);
    Task<CartDto> AddItemToCartAsync(Guid cartId, AddToCartDto dto, CancellationToken cancellationToken);
    Task<CartDto> UpdateItemQuantityAsync(Guid cartId, Guid cartItemId, int quantity, CancellationToken cancellationToken);
    Task<CartDto> RemoveItemFromCartAsync(Guid cartId, Guid cartItemId, CancellationToken cancellationToken);
    Task<CartDto> ClearCartAsync(Guid cartId, CancellationToken cancellationToken);
}
