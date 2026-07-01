using System;

namespace Ecommerce.Application.Interfaces;

public interface IDateTimeProvider
{
    DateTime UtcNow { get; }
}
