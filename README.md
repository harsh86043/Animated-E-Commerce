# Immersive 3D-Feel E-Commerce Starter Template

A production-quality starter template for an immersive, animated, 3D-feel e-commerce website utilizing high-performance frameworks and clean decoupled architectures.

---

## Technology Stack

### Frontend (Reorganized under `/frontend`)
* **Angular 21** (Standalone Components, Signals, Router with lazy-loaded routes)
* **TypeScript**
* **Three.js** (Direct integration for immersive, lag-free 3D product visualizer - no heavy React/R3F wrappers)
* **Tailwind CSS** (CSS Variable-based clean theme system for smooth light/dark toggling)

### Backend (Reorganized under `/backend`)
* **.NET 10 Web API**
* **C#**
* **Clean Architecture style** (decoupled Domain, Application, Infrastructure, and Api layers)
* **Entity Framework Core**
* **MS SQL Server**
* **RESTful API Design** with OpenAPI/Swagger and Secure CORS Defaults
* **Automatic Migrations & Seed Data**

---

## Directory Structure

```text
/
├── frontend/               # Angular 21 immersive web client
├── backend/                # Clean Architecture .NET 10 Web API
│   ├── Ecommerce.sln       # Visual Studio Solution linking all projects
│   ├── src/
│   │   ├── Ecommerce.Domain/         # Domain Entities, Enums, and contracts
│   │   ├── Ecommerce.Application/    # DTOs, interfaces, and core application services
│   │   ├── Ecommerce.Infrastructure/ # EF Core Database context, fluent configs, seed data, and singleton providers
│   │   └── Ecommerce.Api/            # REST API Controllers, Middlewares, and Program.cs configuration
│   └── tests/
│       └── Ecommerce.Tests/          # Placeholder project for test suites
└── docs/
    └── backend-api.md      # Rich, complete REST API specification
```

---

## Backend Clean Architecture Design

### Core Entities & Relationships

* **Category**: One-to-many relationship with `Product` containing Sort Orders and Slugs for optimized SEO/routing.
* **Product**: Rich product details, pricing, discounts, ratings, and navigation collections.
* **ProductImage**: Handles multiple carousel views and designates primary default images.
* **ProductVariant**: Holds custom variant mappings (e.g. Color, Size, Additional Price Adjustments, and item-specific stocks).
* **Customer**: Manages customer profiles, emails, and phone records.
* **Address**: Models shipping and billing details.
* **Cart & CartItem**: Supports anonymous guest sessions (via `SessionId`) and authenticated customer carts. Includes quantity and price-snapshotting to guard against real-time price updates during ongoing sessions.
* **Order & OrderItem**: Converts temporary cart structures into immutable order history items, decrementing inventory stocks in unified DB transactions.

### Performance & Security Enhancements

1. **Database Indexes**: Configured for high-throughput reads:
   - Unique Index on `Product.Slug` & `Category.Slug`
   - Indexes on `Product.CategoryId`, `Product.IsActive`, `Product.IsFeatured`, and `Product.CreatedAtUtc`
   - Indexes on `Cart.SessionId` & `Cart.CustomerId`
   - Indexes on `Order.OrderNumber` (Unique) & `Order.CustomerId`
2. **Cascading Delete Safetynet**: Specific foreign-keys utilize `DeleteBehavior.Restrict` instead of cascade deletes (e.g. `Order` address/customer links) to prevent multiple cascading path conflicts in SQL Server.
3. **Robust Enums**: Order and Payment statuses are mapped as **strings** inside the database (`HasConversion<string>()`) for human-readable queries and seamless future enum additions.
4. **Thin Controllers**: The API controllers are slim, delegating actual business rules to the services in the Application Layer to maintain highly mockable and testable components.

---

## Quick Start (Backend)

### 1. Prerequisites
* Install [.NET SDK 10.0](https://dotnet.microsoft.com/download)
* Install [MS SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (LocalDB comes bundled with Visual Studio)

### 2. Configure Database Connection
Update the `ConnectionStrings:DefaultConnection` in `backend/src/Ecommerce.Api/appsettings.json` or `appsettings.Development.json` with your MSSQL instance connection string.

### 3. Run the API Project
Navigate to the API folder and launch:
```bash
cd backend/src/Ecommerce.Api
dotnet restore
dotnet run
```
On startup, the system automatically runs database migrations and seeds high-fidelity futuristic products, variants, and slider images!

### 4. Interactive Swagger UI
Open your browser to:
`http://localhost:3000/swagger` (or the dynamic port listed in the console) to interactively explore and test all REST endpoints.
