using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ecommerce.Application.Interfaces;

namespace Ecommerce.Infrastructure.Services;

public class MockSmsSender : ISmsSender
{
    private readonly ILogger<MockSmsSender> _logger;

    public MockSmsSender(ILogger<MockSmsSender> logger)
    {
        _logger = logger;
    }

    public Task SendSmsAsync(string phoneNumber, string message, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("MOCK SMS SENDER: To: {PhoneNumber}, Msg: {Message}", phoneNumber, message);
        return Task.CompletedTask;
    }
}
