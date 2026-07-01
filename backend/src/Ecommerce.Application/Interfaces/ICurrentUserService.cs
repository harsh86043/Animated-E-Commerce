using System;

namespace Ecommerce.Application.Interfaces;

public interface ICurrentUserService
{
    Guid? CustomerId { get; }
    string? Email { get; }
    bool IsAuthenticated { get; }
}
