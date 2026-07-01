using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using System.Text.Json.Serialization;
using Ecommerce.Infrastructure.Data;
using Ecommerce.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Infrastructure Databases (SQL Server)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Default Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<EcommerceDbContext>(options =>
    options.UseSqlServer(connectionString, b => b.MigrationsAssembly("Ecommerce.Infrastructure")));

// 2. Configure JSON Formatting & Controller mappings
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// 3. Configure OpenAPI / Swagger support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new() { Title = "Immersive E-Commerce API", Version = "v1" });
});

// 4. Configure Secure CORS Defaults
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultCorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 5. Configure Rate Limiting (Security safeguard placeholder)
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("ApiLimiterPolicy", opt =>
    {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueLimit = 10;
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
    });
});

var app = builder.Build();

// 6. Global Request Pipeline configuration
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "V1 Docs");
        options.RoutePrefix = "swagger"; // Available at http://localhost:PORT/swagger
    });
}
else
{
    app.UseHsts(); // Secure Headers
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseCors("DefaultCorsPolicy");

// Custom Exception Middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseRateLimiter();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
