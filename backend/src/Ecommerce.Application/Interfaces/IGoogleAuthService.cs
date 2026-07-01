using System.Threading;
using System.Threading.Tasks;

namespace Ecommerce.Application.Interfaces;

public interface IGoogleAuthService
{
    Task<GoogleUserDto?> VerifyGoogleTokenAsync(string idToken, CancellationToken cancellationToken = default);
}

public class GoogleUserDto
{
    public required string Email { get; set; }
    public required string Name { get; set; }
    public required string GoogleId { get; set; }
}
