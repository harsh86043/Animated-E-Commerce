using System.Threading;
using System.Threading.Tasks;

namespace Ecommerce.Application.Interfaces;

public interface ISmsSender
{
    Task SendSmsAsync(string phoneNumber, string message, CancellationToken cancellationToken = default);
}
