using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces;

public interface ITokenService
{
    string GenerateJwtToken(User user);
}
