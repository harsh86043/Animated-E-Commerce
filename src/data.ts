import { Product, Category, User, SellerProfile, Order, Banner } from './types';

export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Cyberwear & Apparel",
    slug: "cyberwear",
    description: "Futuristic fabrics, adaptive thermal gear, and illuminated street style.",
    iconName: "ShoppingBag"
  },
  {
    id: "cat-2",
    name: "Neural & Electronics",
    slug: "neural-electronics",
    description: "High-bandwidth bio-chips, spatial audio, and immersive cybernetic modules.",
    iconName: "Cpu"
  },
  {
    id: "cat-3",
    name: "Kinetic Gear & Footwear",
    slug: "kinetic-gear",
    description: "Pressurized gel-sole sneakers, active-recoiling boots, and performance runners.",
    iconName: "Sparkles"
  },
  {
    id: "cat-4",
    name: "Premium Accessories",
    slug: "accessories",
    description: "Hardshell aerospace backpacks, automatic watch dials, and personal shielding nodes.",
    iconName: "Layers"
  }
];

export const mockSellers: SellerProfile[] = [
  {
    id: "seller-1",
    userId: "user-seller",
    storeName: "Apex Cybertech",
    description: "Premium high-grade electronics, neural amplifiers, and cyberware accessories from Neo-Tokyo.",
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=150",
    status: "Active",
    payoutEmail: "seller@demo.com",
    phone: "+1 (555) 123-4567",
    rating: 4.8,
    joinedDate: "2026-01-15"
  },
  {
    id: "seller-2",
    userId: "user-seller-2",
    storeName: "Aether Imprints",
    description: "Custom neural pathways, carbon-threaded bio-interfaces, and kinetic micro-gear.",
    logoUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=150",
    status: "PendingApproval",
    payoutEmail: "new-merchant@demo.com",
    phone: "+1 (555) 987-6543",
    rating: 0.0,
    joinedDate: "2026-06-28"
  },
  {
    id: "seller-3",
    userId: "user-seller-3",
    storeName: "Void Textiles",
    description: "Stealth-weaving cloaking cloaks, thermal carbon jackets, and defensive tactical wear.",
    logoUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=150",
    status: "Suspended",
    rejectionReason: "Incomplete safety documentation and suspected counter-intelligence materials.",
    payoutEmail: "void@demo.com",
    phone: "+1 (555) 777-8888",
    rating: 3.2,
    joinedDate: "2025-11-04"
  }
];

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Nebula Quantum Sneakers",
    slug: "nebula-quantum-sneakers",
    description: "Futuristic footwear with pressurized cybernetic gel soles, adaptive fit micro-threading, and integrated neon step-glow modules.",
    price: 189.99,
    discountPrice: 159.99,
    rating: 4.9,
    stock: 24,
    isFeatured: true,
    category: "Kinetic Gear & Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
    fallbackImages: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600"
    ],
    variants: [
      { name: "Size", values: ["US 8", "US 9", "US 10", "US 11"] },
      { name: "Neon Glow", values: ["Cyber Orange", "Laser Cyan", "Stealth Dark"] }
    ],
    sellerId: "seller-1",
    approvalStatus: "Approved",
    isActive: true
  },
  {
    id: "prod-2",
    name: "Apex ANC Holographic Earbuds",
    slug: "apex-anc-holographic-earbuds",
    description: "Premium spatial audio earbuds engineered with physical active-noise canceling modules, graphene dynamic drivers, and magnetic induction docks.",
    price: 249.99,
    rating: 4.8,
    stock: 12,
    isFeatured: true,
    category: "Neural & Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600",
    fallbackImages: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600"
    ],
    variants: [
      { name: "Enclosure", values: ["Tungsten Steel", "Anodized Cobalt"] }
    ],
    sellerId: "seller-1",
    approvalStatus: "Approved",
    isActive: true
  },
  {
    id: "prod-3",
    name: "Carbon Series Hardshell Pack",
    slug: "carbon-series-hardshell-pack",
    description: "Waterproof aerospace-grade composite carbon-fiber shell backpack with integrated TSA biometric locks, discrete storage, and integrated USB-C dynamic passthrough charging.",
    price: 129.99,
    discountPrice: 110.00,
    rating: 4.7,
    stock: 40,
    isFeatured: false,
    category: "Premium Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600",
    fallbackImages: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600"
    ],
    variants: [
      { name: "Capacity", values: ["22L Standard", "35L Tactical"] }
    ],
    sellerId: "seller-1",
    approvalStatus: "Approved",
    isActive: true
  },
  {
    id: "prod-4",
    name: "Lunar Chronos Mechanical Dial",
    slug: "lunar-chronos-mechanical-dial",
    description: "Heavy aerospace alloy automatic movement mechanical watch with custom high-contrast sapphire window face and lightweight space-grade titanium links.",
    price: 599.99,
    rating: 5.0,
    stock: 5,
    isFeatured: true,
    category: "Premium Accessories",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
    fallbackImages: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600"
    ],
    variants: [
      { name: "Strap Style", values: ["Mesh Titanium Link", "Obsidian Hydro-Silt"] }
    ],
    sellerId: "seller-1",
    approvalStatus: "Approved",
    isActive: true
  },
  {
    id: "prod-5",
    name: "Thermal Cloak Kinetic Parka",
    slug: "thermal-cloak-kinetic-parka",
    description: "Intelligent carbon-nanotube-threaded jacket with active heating filaments, responsive outer waterproofing, and hidden secure interior gear compartments.",
    price: 349.99,
    discountPrice: 299.99,
    rating: 4.6,
    stock: 18,
    isFeatured: true,
    category: "Cyberwear & Apparel",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=600",
    fallbackImages: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=600"
    ],
    variants: [
      { name: "Size", values: ["S", "M", "L", "XL"] },
      { name: "Filament", values: ["Classic Amber", "Stealth Black"] }
    ],
    sellerId: "seller-2",
    approvalStatus: "PendingReview", // Awaiting moderation
    isActive: false
  },
  {
    id: "prod-6",
    name: "Synthesizer Bio-Processor Link",
    slug: "synthesizer-bio-processor-link",
    description: "Unapproved high-frequency cerebral connector. Enhances sonic response feedback loops in biological neural nodes.",
    price: 1200.00,
    rating: 3.5,
    stock: 2,
    isFeatured: false,
    category: "Neural & Electronics",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600",
    fallbackImages: [],
    variants: [],
    sellerId: "seller-3",
    approvalStatus: "Suspended", // Suspended product
    isActive: false
  },
  {
    id: "prod-7",
    name: "Carbon Nano-Sleeve Jacket",
    slug: "carbon-nano-sleeve-jacket",
    description: "Lightweight flexible protective outer shell. Features compression weaves and integrated forearm status displays.",
    price: 199.99,
    rating: 4.4,
    stock: 15,
    isFeatured: false,
    category: "Cyberwear & Apparel",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600",
    fallbackImages: [],
    variants: [
      { name: "Size", values: ["M", "L"] }
    ],
    sellerId: "seller-1",
    approvalStatus: "Draft", // Draft
    isActive: false
  }
];

export const mockBanners: Banner[] = [
  {
    id: "ban-1",
    title: "NEO-STREETS ESCAPADE",
    subtitle: "Up to 30% Off Quantum Footwear and Heated Filament Cyberwear.",
    imageUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=1200",
    linkTo: "cyberwear",
    isActive: true
  },
  {
    id: "ban-2",
    title: "HYPER-SPEED AUDIO NODES",
    subtitle: "Experience Spatial sound with carbon nanotube drivers.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200",
    linkTo: "neural-electronics",
    isActive: true
  }
];

export const mockOrders: Order[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-992384-N3",
    date: "2026-06-25T14:32:00Z",
    customerId: "user-customer",
    customerName: "Jane Doe",
    items: [
      {
        productId: "prod-1",
        productName: "Nebula Quantum Sneakers",
        quantity: 1,
        price: 159.99,
        selectedVariants: "Size: US 10, Neon Glow: Laser Cyan",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=150",
        sellerId: "seller-1"
      }
    ],
    subtotal: 159.99,
    shippingFee: 15.00,
    total: 174.99,
    status: "Delivered",
    paymentMethod: "Credit Card (•••• 4242)",
    shippingAddress: {
      id: "addr-1",
      fullName: "Jane Doe",
      street: "142 Cyber Square, Level 4",
      city: "Neo-Boston",
      state: "MA",
      postalCode: "02108",
      country: "United States",
      isDefault: true
    }
  },
  {
    id: "ord-2",
    orderNumber: "ORD-883491-X2",
    date: "2026-06-29T10:15:00Z",
    customerId: "user-customer",
    customerName: "Jane Doe",
    items: [
      {
        productId: "prod-2",
        productName: "Apex ANC Holographic Earbuds",
        quantity: 1,
        price: 249.99,
        selectedVariants: "Enclosure: Tungsten Steel",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=150",
        sellerId: "seller-1"
      },
      {
        productId: "prod-3",
        productName: "Carbon Series Hardshell Pack",
        quantity: 1,
        price: 110.00,
        selectedVariants: "Capacity: 22L Standard",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=150",
        sellerId: "seller-1"
      }
    ],
    subtotal: 359.99,
    shippingFee: 15.00,
    total: 374.99,
    status: "Processing",
    paymentMethod: "Google Pay",
    shippingAddress: {
      id: "addr-1",
      fullName: "Jane Doe",
      street: "142 Cyber Square, Level 4",
      city: "Neo-Boston",
      state: "MA",
      postalCode: "02108",
      country: "United States",
      isDefault: true
    }
  }
];

export const mockUsers: User[] = [
  {
    id: "user-admin",
    email: "admin@demo.com",
    name: "Principal Administrator",
    role: "Admin",
    addresses: [],
    wishlist: []
  },
  {
    id: "user-seller",
    email: "seller@demo.com",
    name: "Apex Merchant Team",
    role: "Seller",
    addresses: [],
    wishlist: []
  },
  {
    id: "user-customer",
    email: "customer@demo.com",
    name: "Jane Doe",
    role: "Customer",
    addresses: [
      {
        id: "addr-1",
        fullName: "Jane Doe",
        street: "142 Cyber Square, Level 4",
        city: "Neo-Boston",
        state: "MA",
        postalCode: "02108",
        country: "United States",
        isDefault: true
      }
    ],
    wishlist: ["prod-1", "prod-3"]
  }
];
