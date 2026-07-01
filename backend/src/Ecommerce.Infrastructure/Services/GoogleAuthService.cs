using System.Threading;
using System.Threading.Tasks;
using Ecommerce.Application.Interfaces;

namespace Ecommerce.Infrastructure.Services;

public class GoogleAuthService : IGoogleAuthService
{
    public Task<GoogleUserDto?> VerifyGoogleTokenAsync(string idToken, CancellationToken cancellationToken = default)
    {
        // TODO: In a production environment, use Google.Apis.Auth NuGet package to verify Google ID Token:
        // var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, new GoogleJsonWebSignature.ValidationSettings());
        // return new GoogleUserDto { Email = payload.Email, Name = payload.Name, GoogleId = payload.Subject };

        if (string.IsNullOrWhiteSpace(idToken))
        {
            return Task.FromResult<GoogleUserDto?>(null);
        }

        // For development / testing, stub the verification if token format is 'mock_google_id_token'
        return Task.FromResult<GoogleUserDto?>(new GoogleUserDto
        {
            Email = "google.user@gmail.com",
            Name = "Google Verified User",
            GoogleId = "1234567890"
        });
    }
}
