using System;
using Ecommerce.Application.Interfaces;

namespace Ecommerce.Infrastructure.Services;

public class DateTimeProvider : IDateTimeProvider
{
    public DateTime UtcNow => DateTime.UtcNow;
}
