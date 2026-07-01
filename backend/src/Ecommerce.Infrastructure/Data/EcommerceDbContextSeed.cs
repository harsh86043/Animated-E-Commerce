using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Data;

public static class EcommerceDbContextSeed
{
    public static async Task SeedAsync(EcommerceDbContext context)
    {
        // 1. Seed Categories if empty
        if (!context.Categories.Any())
        {
            var categories = new List<Category>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Cyberwear",
                    Slug = "cyberwear",
                    Description = "Premium sci-fi apparel with integrated LED and neural fiber accents.",
                    ImageUrl = "/assets/images/categories/cyberwear.jpg",
                    SortOrder = 1,
                    IsActive = true,
                    CreatedAtUtc = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Neural Imprints",
                    Slug = "neural-imprints",
                    Description = "Next-generation memory streams and personality overlays.",
                    ImageUrl = "/assets/images/categories/neural-imprints.jpg",
                    SortOrder = 2,
                    IsActive = true,
                    CreatedAtUtc = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Kinetic Gear",
                    Slug = "kinetic-gear",
                    Description = "Augmented sports gear and tactical motion enhancers.",
                    ImageUrl = "/assets/images/categories/kinetic-gear.jpg",
                    SortOrder = 3,
                    IsActive = true,
                    CreatedAtUtc = DateTime.UtcNow
                }
            };

            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }

        // 2. Seed Products and Relations if empty
        if (!context.Products.Any())
        {
            var cyberwearCat = context.Categories.First(c => c.Slug == "cyberwear");
            var neuralCat = context.Categories.First(c => c.Slug == "neural-imprints");
            var kineticCat = context.Categories.First(c => c.Slug == "kinetic-gear");

            var products = new List<Product>
            {
                // Product 1: Helios Visor V2
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = cyberwearCat.Id,
                    Name = "Helios Visor V2",
                    Slug = "helios-visor-v2",
                    ShortDescription = "Next-gen AR visor with translation & thermal vision.",
                    Description = "Augmented reality smart visor with real-time HUD, translation overlays, and thermal night vision.",
                    Price = 1250.00m,
                    DiscountPrice = 999.00m,
                    Rating = 4.8,
                    ReviewCount = 42,
                    StockQuantity = 15,
                    IsFeatured = true,
                    IsActive = true,
                    ImageUrl = "/assets/images/products/helios-visor.jpg",
                    ModelUrl = "helios_visor_v2.glb",
                    CreatedAtUtc = DateTime.UtcNow,
                    Images = new List<ProductImage>
                    {
                        new()
                        {
                            Url = "/assets/images/products/helios-visor.jpg",
                            AltText = "Helios Visor V2 Front View",
                            SortOrder = 1,
                            IsPrimary = true
                        },
                        new()
                        {
                            Url = "/assets/images/products/helios-visor-angle.jpg",
                            AltText = "Helios Visor V2 Angle View",
                            SortOrder = 2,
                            IsPrimary = false
                        }
                    },
                    Variants = new List<ProductVariant>
                    {
                        new()
                        {
                            Name = "Color",
                            Value = "Neon Purple",
                            StockQuantity = 8,
                            AdditionalPrice = 0.00m,
                            IsActive = true
                        },
                        new()
                        {
                            Name = "Color",
                            Value = "Carbon Black",
                            StockQuantity = 7,
                            AdditionalPrice = 50.00m,
                            IsActive = true
                        }
                    }
                },

                // Product 2: Aether Overdrive Membrane
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = neuralCat.Id,
                    Name = "Aether Overdrive Membrane",
                    Slug = "aether-overdrive-membrane",
                    ShortDescription = "Reflex-enhancing premium neural imprint.",
                    Description = "Instant neural overlay that unlocks advanced procedural memory. Enhances reaction times and reflexes by 150%.",
                    Price = 450.00m,
                    DiscountPrice = null,
                    Rating = 4.9,
                    ReviewCount = 118,
                    StockQuantity = 50,
                    IsFeatured = true,
                    IsActive = true,
                    ImageUrl = "/assets/images/products/aether-overdrive.jpg",
                    ModelUrl = "aether_overdrive.glb",
                    CreatedAtUtc = DateTime.UtcNow,
                    Images = new List<ProductImage>
                    {
                        new()
                        {
                            Url = "/assets/images/products/aether-overdrive.jpg",
                            AltText = "Aether Overdrive Membrane Cartridge",
                            SortOrder = 1,
                            IsPrimary = true
                        }
                    },
                    Variants = new List<ProductVariant>
                    {
                        new()
                        {
                            Name = "Format",
                            Value = "Digital Injection",
                            StockQuantity = 30,
                            AdditionalPrice = 0.00m,
                            IsActive = true
                        },
                        new()
                        {
                            Name = "Format",
                            Value = "Bio-Cartridge",
                            StockQuantity = 20,
                            AdditionalPrice = 75.00m,
                            IsActive = true
                        }
                    }
                },

                // Product 3: Apex Kinetic Boots
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = kineticCat.Id,
                    Name = "Apex Kinetic Boots",
                    Slug = "apex-kinetic-boots",
                    ShortDescription = "High-velocity gravity-assisted boots.",
                    Description = "Pressurized gravity-assisted boots enabling high-velocity dashes, magnetic surface adhesion, and fall damping.",
                    Price = 850.00m,
                    DiscountPrice = 720.00m,
                    Rating = 4.6,
                    ReviewCount = 19,
                    StockQuantity = 8,
                    IsFeatured = false,
                    IsActive = true,
                    ImageUrl = "/assets/images/products/apex-boots.jpg",
                    ModelUrl = "apex_boots.glb",
                    CreatedAtUtc = DateTime.UtcNow,
                    Images = new List<ProductImage>
                    {
                        new()
                        {
                            Url = "/assets/images/products/apex-boots.jpg",
                            AltText = "Apex Kinetic Boots Side View",
                            SortOrder = 1,
                            IsPrimary = true
                        }
                    },
                    Variants = new List<ProductVariant>
                    {
                        new()
                        {
                            Name = "Size",
                            Value = "US 9",
                            StockQuantity = 4,
                            AdditionalPrice = 0.00m,
                            IsActive = true
                        },
                        new()
                        {
                            Name = "Size",
                            Value = "US 10",
                            StockQuantity = 4,
                            AdditionalPrice = 0.00m,
                            IsActive = true
                        }
                    }
                }
            };

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
        }
    }
}
