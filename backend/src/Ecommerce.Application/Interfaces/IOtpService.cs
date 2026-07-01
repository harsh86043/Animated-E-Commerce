using System.Threading;
using System.Threading.Tasks;

namespace Ecommerce.Application.Interfaces;

public interface IOtpService
{
    Task<string> GenerateOtpAsync(string destination, string destinationType, string purpose, CancellationToken cancellationToken = default);
    Task<bool> VerifyOtpAsync(string destination, string otp, string purpose, CancellationToken cancellationToken = default);
}
