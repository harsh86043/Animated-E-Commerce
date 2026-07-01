using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ecommerce.Application.Interfaces;

namespace Ecommerce.Infrastructure.Services;

public class MockEmailSender : IEmailSender
{
    private readonly ILogger<MockEmailSender> _logger;

    public MockEmailSender(ILogger<MockEmailSender> logger)
    {
        _logger = logger;
    }

    public Task SendEmailAsync(string email, string subject, string body, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("MOCK EMAIL SENDER: To: {Email}, Subject: {Subject}, Body: {Body}", email, subject, body);
        return Task.CompletedTask;
    }
}
