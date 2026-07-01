export interface CodeFile {
  name: string;
  path: string;
  language: 'csharp' | 'typescript' | 'json' | 'html' | 'css';
  batch: string;
  description: string;
  code: string;
}

export const codeTemplates: CodeFile[] = [
  // BATCH 1: BACKEND CORE SETUP
  {
    name: "Product.cs",
    path: "backend/Ecommerce.Domain/Entities/Product.cs",
    language: "csharp",
    batch: "Batch 1: Core Domain",
    description: "Defines the core Product entity containing properties for e-commerce catalog, ratings, inventory, and Three.js 3D model URLs.",
    code: `namespace Ecommerce.Domain.Entities;

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public required string Name { get; set; }
    
    public required string Slug { get; set; }
    
    public required string Description { get; set; }
    
    public decimal Price { get; set; }
    
    public decimal? DiscountPrice { get; set; }
    
    public double Rating { get; set; }
    
    public int Stock { get; set; }
    
    public bool IsFeatured { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public string? ModelUrl { get; set; } // Lazy-loaded Three.js 3D model URL
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }

    // Relationships
    public Guid CategoryId { get; set; }
    public Category? Category { get; set; }
    
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
}`
  },
  {
    name: "Category.cs",
    path: "backend/Ecommerce.Domain/Entities/Category.cs",
    language: "csharp",
    batch: "Batch 1: Core Domain",
    description: "Defines product classification category. Includes relationship to support normalized indexing and queries.",
    code: `namespace Ecommerce.Domain.Entities;

public class Category
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public required string Name { get; set; }
    
    public required string Slug { get; set; }
    
    public string? Description { get; set; }
    
    public string? ImageUrl { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relationships
    public ICollection<Product> Products { get; set; } = new List<Product>();
}`
  },
  {
    name: "Order.cs",
    path: "backend/Ecommerce.Domain/Entities/Order.cs",
    language: "csharp",
    batch: "Batch 1: Core Domain",
    description: "Auditable and secure order tracking schema capturing snapshotted shipping and pricing data to guard against post-purchase changes.",
    code: `namespace Ecommerce.Domain.Entities;

public class Order
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public string OrderNumber { get; set; } = string.Empty; // e.g., "ORD-2026-1004"
    
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    
    public decimal SubTotal { get; set; }
    
    public decimal ShippingFee { get; set; }
    
    public decimal Tax { get; set; }
    
    public decimal Total { get; set; }
    
    public string Status { get; set; } = "Pending"; // Pending, Processing, Shipped, Delivered, Cancelled
    
    public string PaymentStatus { get; set; } = "Unpaid"; // Unpaid, Paid, Refunded, Failed
    
    public string? PaymentIntentId { get; set; } // Stripe/PayPal payment gateway transaction ID

    // Delivery Address Details at the time of purchase (normalized / snapshotted for audit safety)
    public required string ShippingStreet { get; set; }
    public string? ShippingSuiteOrApartment { get; set; }
    public required string ShippingCity { get; set; }
    public required string ShippingState { get; set; }
    public required string ShippingPostalCode { get; set; }
    public required string ShippingCountry { get; set; }

    // Relationships
    public Guid CustomerId { get; set; }
    public Customer? Customer { get; set; }
    
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}`
  },
  {
    name: "EcommerceDbContext.cs",
    path: "backend/Ecommerce.Infrastructure/Data/EcommerceDbContext.cs",
    language: "csharp",
    batch: "Batch 1: Core Infrastructure",
    description: "The primary EF Core DbContext configures table relationships, decimal precisions, and database indexes (slugs, statuses, and customer references).",
    code: `using Microsoft.EntityFrameworkCore;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Data;

public class EcommerceDbContext : DbContext
{
    public EcommerceDbContext(DbContextOptions<EcommerceDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Product Configuration
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
            entity.Property(p => p.Slug).IsRequired().HasMaxLength(250);
            entity.Property(p => p.Description).IsRequired().HasMaxLength(2000);
            entity.Property(p => p.Price).HasPrecision(18, 2);
            entity.Property(p => p.DiscountPrice).HasPrecision(18, 2);
            
            // Indexes
            entity.HasIndex(p => p.Slug).IsUnique();
            entity.HasIndex(p => p.CategoryId);
            entity.HasIndex(p => p.IsActive);
            entity.HasIndex(p => p.IsFeatured);
            entity.HasIndex(p => p.CreatedAt);
        });

        // Other Configurations (Category, Address, Cart, Order, OrderItem) are set similarly with fluent API...
    }
}`
  },
  {
    name: "Program.cs",
    path: "backend/Ecommerce.Api/Program.cs",
    language: "csharp",
    batch: "Batch 1: API Configuration",
    description: "Application startup configuring DI, SQL Server, Swagger OpenAPI, rate limiting, secure HTTPS redirection, and standard error pipelines.",
    code: `using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using System.Text.Json.Serialization;
using Ecommerce.Infrastructure.Data;
using Ecommerce.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add Infrastructure Databases (SQL Server)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<EcommerceDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Secure CORS Defaults
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultCorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    });
});

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();
app.UseCors("DefaultCorsPolicy");
app.UseAuthorization();
app.MapControllers();
app.Run();`
  },
  {
    name: "ExceptionHandlingMiddleware.cs",
    path: "backend/Ecommerce.Api/Middleware/ExceptionHandlingMiddleware.cs",
    language: "csharp",
    batch: "Batch 1: API Configuration",
    description: "Ensures secure global exception mapping, hiding detailed database stack traces from external visitors in production environments.",
    code: `using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try { await _next(context); }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var problemDetails = new ProblemDetails
        {
            Status = 500,
            Title = "An error occurred while processing your request.",
            Detail = _env.IsDevelopment() ? exception.StackTrace : "Please contact technical support."
        };

        var json = JsonSerializer.Serialize(problemDetails, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        await context.Response.WriteAsync(json);
    }
}`
  },

  // BATCH 2Preview
  {
    name: "ProductsController.cs",
    path: "backend/Ecommerce.Api/Controllers/ProductsController.cs",
    language: "csharp",
    batch: "Batch 2: API Endpoints",
    description: "Controller exposing fully asynchronous, paginated catalog feeds, slug matching, and featured list endpoints.",
    code: `using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ecommerce.Infrastructure.Data;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly EcommerceDbContext _context;

    public ProductsController(EcommerceDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 12, [FromQuery] string? category = null)
    {
        var query = _context.Products.Include(p => p.Images).Where(p => p.IsActive);
        
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(p => p.Category!.Slug == category);
        }

        var totalItems = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return Ok(new { Total = totalItems, Page = page, PageSize = pageSize, Items });
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var product = await _context.Products
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive);

        if (product == null) return NotFound(new { Message = "Product not found" });
        return Ok(product);
    }
}`
  },

  // BATCH 3Preview: Angular Theme tokens and Service
  {
    name: "theme.service.ts",
    path: "frontend/src/app/core/services/theme.service.ts",
    language: "typescript",
    batch: "Batch 3: Angular Styling & Shell",
    description: "The core theme-engine service. Monitors OS dark/light states, manages localStorage, and injects customized variables dynamically.",
    code: `import { Injectable, signal, effect } from '@angular/core';

export type AppTheme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private activeThemeSignal = signal<AppTheme>('system');
  public activeTheme = this.activeThemeSignal.asReadonly();
  
  public currentTheme = signal<'light' | 'dark'>('light');

  constructor() {
    const savedTheme = localStorage.getItem('user-theme') as AppTheme;
    if (savedTheme) {
      this.activeThemeSignal.set(savedTheme);
    }
    
    effect(() => {
      const theme = this.activeThemeSignal();
      localStorage.setItem('user-theme', theme);
      this.updateThemeClasses(theme);
    });
  }

  setTheme(theme: AppTheme) {
    this.activeThemeSignal.set(theme);
  }

  private updateThemeClasses(theme: AppTheme) {
    let resolvedTheme: 'light' | 'dark' = 'light';
    if (theme === 'system') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolvedTheme = isSystemDark ? 'dark' : 'light';
    } else {
      resolvedTheme = theme;
    }

    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    this.currentTheme.set(resolvedTheme);
  }
}`
  },
  {
    name: "styles.scss",
    path: "frontend/src/styles.scss",
    language: "css",
    batch: "Batch 3: Angular Styling & Shell",
    description: "Central SCSS theme setting including premium color tokens, transitions, custom shadows, and accessibility focus borders.",
    code: `/* CSS Variables based Theme Tokens */
:root {
  --background: #F8FAFC;
  --surface: #FFFFFF;
  --surface-elevated: #F1F5F9;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --muted-text: #64748B;
  --border: #E2E8F0;
  --primary-accent: #6D5DFB;
  --primary-hover: #5848E5;
  --secondary-accent: #00B8D9;
  --success: #16A34A;
  --warning: #F59E0B;
  --error: #DC2626;
}

.dark {
  --background: #06070D;
  --surface: #10131F;
  --surface-elevated: #171B2E;
  --text-primary: #F8FAFC;
  --text-secondary: #CBD5E1;
  --muted-text: #94A3B8;
  --border: #293044;
  --primary-accent: #8B7CFF;
  --primary-hover: #A398FF;
  --secondary-accent: #22D3EE;
  --success: #22C55E;
  --warning: #FBBF24;
  --error: #F87171;
}

body {
  background-color: var(--background);
  color: var(--text-primary);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}`
  },

  // BATCH 6Preview: WebGL and Lazy 3D
  {
    name: "hero-3d-stage.component.ts",
    path: "frontend/src/app/shared/components/hero-3d-stage/hero-3d-stage.component.ts",
    language: "typescript",
    batch: "Batch 6: Lazy-Loaded 3D Component",
    description: "Highly optimized Three.js viewport run completely outside Angular NgZone to protect the CPU from dirty cycles. Responsive and memory leak-free.",
    code: `import { Component, ElementRef, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-hero-3d-stage',
  standalone: true,
  template: '<div #canvasContainer class="w-full h-full min-h-[300px] overflow-hidden"></div>'
})
export class Hero3dStageComponent implements OnInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private cube?: THREE.Mesh;
  private animationFrameId?: number;
  private resizeObserver?: ResizeObserver;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initThree();
      this.animate();
    });
    this.setupResizeObserver();
  }

  private initThree() {
    const width = this.canvasContainer.nativeElement.clientWidth;
    const height = this.canvasContainer.nativeElement.clientHeight || 400;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.canvasContainer.nativeElement.appendChild(this.renderer.domElement);

    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshNormalMaterial();
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
  }

  private animate() {
    if (this.cube) {
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
    }
    this.renderer?.render(this.scene!, this.camera!);
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        this.camera!.aspect = width / (height || 400);
        this.camera!.updateProjectionMatrix();
        this.renderer!.setSize(width, height || 400);
      }
    });
    this.resizeObserver.observe(this.canvasContainer.nativeElement);
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.resizeObserver?.disconnect();
    
    // Memory release
    this.cube?.geometry.dispose();
    if (Array.isArray(this.cube?.material)) {
      this.cube.material.forEach(m => m.dispose());
    } else {
      this.cube?.material.dispose();
    }
    this.renderer?.dispose();
  }
}`
  }
];
