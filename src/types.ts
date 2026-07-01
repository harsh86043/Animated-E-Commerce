export type UserRole = 'Guest' | 'Customer' | 'Seller' | 'Admin';

export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  addresses: Address[];
  wishlist: string[]; // List of product IDs
}

export interface SellerProfile {
  id: string;
  userId: string;
  storeName: string;
  description: string;
  logoUrl?: string;
  status: 'PendingApproval' | 'Active' | 'Rejected' | 'Suspended';
  rejectionReason?: string;
  payoutEmail?: string;
  phone?: string;
  rating: number;
  joinedDate: string;
}

export interface ProductVariant {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  rating: number;
  stock: number;
  isFeatured: boolean;
  category: string;
  image: string;
  fallbackImages: string[];
  variants: ProductVariant[];
  sellerId?: string; // Connected seller
  approvalStatus: 'Draft' | 'PendingReview' | 'Approved' | 'Rejected' | 'Suspended';
  rejectionFeedback?: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string; // lucide icon name
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants: string; // serialized e.g. "Size: US 9, Accent: Red"
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  selectedVariants: string;
  image: string;
  sellerId?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  sellerId?: string; // If order is split or filtered per seller
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'Pending' | 'PaymentReceived' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  shippingAddress: Address;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkTo: string;
  isActive: boolean;
}
