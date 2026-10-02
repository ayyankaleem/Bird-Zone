export interface Product {
  id: string;
  name: string;
  nameUrdu: string;
  category: 'Exotic Birds' | 'Cages & Aviaries' | 'Feed & Nutrition' | 'Toys & Perches';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  inStock: boolean;
  stockCount: number;
  sku: string;
  description: string;
  features: string[];
  careTips?: string;
  diet?: string;
  dimensions?: string;
  origin?: string;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameUrdu: string;
  description: string;
  iconName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  nameUrdu: string;
  rate: number;
  freeDeliveryThreshold?: number;
  eta: string;
  description: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  text: string;
  verifiedBuyer: boolean;
  itemPurchased: string;
}

export interface CareGuide {
  id: string;
  title: string;
  titleUrdu: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
}

export interface OrderConfirmation {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  zone: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'cod' | 'jazzcash' | 'easypaisa' | 'whatsapp';
  date: string;
  status: 'Received' | 'Confirmed' | 'Dispatched';
}
