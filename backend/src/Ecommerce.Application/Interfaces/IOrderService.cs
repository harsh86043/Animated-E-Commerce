using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Ecommerce.Application.Dtos;

namespace Ecommerce.Application.Interfaces;

public interface IOrderService
{
    Task<CheckoutResultDto> CheckoutAsync(CreateOrderDto dto, CancellationToken cancellationToken);
    Task<OrderDto?> GetOrderByIdAsync(Guid orderId, CancellationToken cancellationToken);
    Task<OrderDto?> GetOrderByNumberAsync(string orderNumber, CancellationToken cancellationToken);
    Task<IEnumerable<OrderDto>> GetCustomerOrdersAsync(Guid customerId, CancellationToken cancellationToken);
}
