import { Product, Category, DeliveryZone, OrderConfirmation } from '../types';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'staff';
  avatar?: string;
  lastLoginAt?: string;
}

export interface ProductFormData {
  id?: string;
  name: string;
  nameUrdu: string;
  slug?: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  description: string;
  regularPrice: number;
  salePrice?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  availabilityStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'enquiry_only';
  productStatus: 'published' | 'draft' | 'archived';
  productType: 'Bird' | 'Cage' | 'Feed' | 'Toy' | 'Accessory' | 'Other';
  isFeatured: boolean;
  mainImage: string;
  galleryImages: string[];
  imageAlt?: string;
  weight?: string;
  dimensions?: string;
  careInstructions?: string;
  diet?: string;
  origin?: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  species?: string;
  ageRange?: string;
  handTamed?: boolean;
  availabilityNotes?: string;
  deliveryEligibility: 'all' | 'lahore_only' | 'pickup_only';
}

export interface DBCategoryData {
  id: string;
  name: string;
  nameUrdu: string;
  slug: string;
  description: string;
  thumbnail: string;
  iconName: string;
  displayOrder: number;
  active: boolean;
  productCount?: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface OrderItemData {
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  image: string;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  cityArea: string;
  deliveryZoneId: string;
  deliveryZoneName: string;
  items: OrderItemData[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  orderStatus:
    | 'Pending Confirmation'
    | 'Confirmed'
    | 'Processing'
    | 'Ready for Pickup'
    | 'Dispatched'
    | 'Delivered'
    | 'Cancelled'
    | 'Returned';
  paymentMethod: 'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'whatsapp';
  paymentStatus: 'Unpaid' | 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  transactionId?: string;
  internalNotes?: string;
  customerNotes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    updatedBy: string;
    note?: string;
  }>;
}

export interface CustomerData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  addresses: string[];
  status: 'active' | 'blocked';
  createdAt: string;
}

export interface InventoryMovementData {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  changeAmount: number;
  reason: 'sale' | 'restock' | 'damage' | 'manual_adjustment' | 'order_cancelled' | 'return';
  previousStock: number;
  newStock: number;
  referenceId?: string;
  adminName: string;
  timestamp: string;
}

export interface CouponData {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  active: boolean;
  createdAt: string;
}

export interface ReportsData {
  metrics: {
    totalOrders: number;
    validOrdersCount: number;
    cancelledOrdersCount: number;
    pendingConfirmation: number;
    processingCount: number;
    completedOrdersCount: number;
    totalProductsCount: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalGrossSales: number;
    totalDeliveryCollected: number;
    totalDiscountsGiven: number;
    netRevenue: number;
  };
  statusCounts: Record<string, number>;
  paymentCounts: Record<string, { count: number; total: number }>;
  topProducts: Array<{ name: string; sku: string; quantity: number; revenue: number }>;
  last7Days: Array<{ date: string; sales: number; orders: number }>;
}

export interface NotificationData {
  id: string;
  type: 'new_order' | 'low_stock' | 'out_of_stock' | 'payment_pending' | 'system';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLogData {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface StoreSettingsData {
  general: {
    storeName: string;
    tagline: string;
    contactPhone: string;
    whatsappNumber: string;
    email: string;
    address: string;
    businessHours: string;
    currency: string;
    locale: string;
  };
  delivery: {
    deliveryEnabled: boolean;
    freeDeliveryThreshold: number;
    zones: Array<{
      id: string;
      name: string;
      nameUrdu: string;
      rate: number;
      freeDeliveryThreshold?: number;
      eta: string;
      description: string;
    }>;
    pickupEnabled: boolean;
    pickupAddress: string;
    expectedDeliveryNote: string;
  };
  payment: {
    codEnabled: boolean;
    jazzcashEnabled: boolean;
    jazzcashAccount: string;
    jazzcashTitle: string;
    easypaisaEnabled: boolean;
    easypaisaAccount: string;
    easypaisaTitle: string;
    bankTransferEnabled: boolean;
    bankDetails: string;
    instructions: string;
  };
  content: {
    heroHeading: string;
    heroHeadingUrdu: string;
    heroSubtitle: string;
    heroImage: string;
    announcementText: string;
    aboutText: string;
    footerNote: string;
  };
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('birdzone_admin_token');
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('birdzone_admin_token', token);
    } else {
      localStorage.removeItem('birdzone_admin_token');
    }
  }

  public getToken() {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.setToken(null);
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
  }

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await this.request<{ token: string; user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token);
    return res;
  }

  async getCurrentUser(): Promise<AdminUser> {
    return this.request<AdminUser>('/auth/me');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async getTeam(): Promise<any[]> {
    return this.request('/auth/team');
  }

  async addTeamMember(data: any): Promise<any> {
    return this.request('/auth/team', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Upload
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.request('/upload', {
      method: 'POST',
      body: formData,
    });
  }

  // Products
  async getProducts(params: Record<string, string> = {}): Promise<{ products: ProductFormData[]; total: number; totalPages: number }> {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products?${query}`);
  }

  async getProduct(id: string): Promise<ProductFormData> {
    return this.request(`/products/${id}`);
  }

  async createProduct(data: Partial<ProductFormData>): Promise<ProductFormData> {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<ProductFormData> {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async duplicateProduct(id: string): Promise<ProductFormData> {
    return this.request(`/products/${id}/duplicate`, {
      method: 'POST',
    });
  }

  async bulkProducts(ids: string[], action: string, value?: any): Promise<{ success: boolean; count: number }> {
    return this.request('/products/bulk', {
      method: 'PATCH',
      body: JSON.stringify({ ids, action, value }),
    });
  }

  // Categories
  async getCategories(): Promise<DBCategoryData[]> {
    return this.request('/categories');
  }

  async createCategory(data: Partial<DBCategoryData>): Promise<DBCategoryData> {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: Partial<DBCategoryData>): Promise<DBCategoryData> {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string, reassignTo?: string): Promise<{ success: boolean }> {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ reassignTo }),
    });
  }

  // Orders
  async getOrders(params: Record<string, string> = {}): Promise<{ orders: OrderData[]; total: number; totalPages: number }> {
    const query = new URLSearchParams(params).toString();
    return this.request(`/orders?${query}`);
  }

  async getOrder(id: string): Promise<OrderData> {
    return this.request(`/orders/${id}`);
  }

  async createOrder(data: any): Promise<OrderData> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrderStatus(
    id: string,
    orderStatus?: string,
    paymentStatus?: string,
    note?: string,
    reason?: string
  ): Promise<OrderData> {
    return this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ orderStatus, paymentStatus, note, reason }),
    });
  }

  async addOrderNotes(id: string, internalNotes: string): Promise<{ success: boolean; internalNotes: string }> {
    return this.request(`/orders/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ internalNotes }),
    });
  }

  // Customers
  async getCustomers(search?: string): Promise<CustomerData[]> {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/customers${q}`);
  }

  async getCustomer(id: string): Promise<{ customer: CustomerData; orders: OrderData[] }> {
    return this.request(`/customers/${id}`);
  }

  // Inventory
  async getInventory(): Promise<{
    summary: { totalProducts: number; totalUnits: number; lowStockCount: number; outOfStockCount: number };
    lowStock: ProductFormData[];
    outOfStock: ProductFormData[];
    recentMovements: InventoryMovementData[];
  }> {
    return this.request('/inventory');
  }

  async adjustStock(productId: string, newStock: number, reason: string, notes?: string): Promise<ProductFormData> {
    return this.request('/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify({ productId, newStock, reason, notes }),
    });
  }

  // Coupons
  async getCoupons(): Promise<CouponData[]> {
    return this.request('/coupons');
  }

  async createCoupon(data: Partial<CouponData>): Promise<CouponData> {
    return this.request('/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; code: string; discountType: string; discountValue: number; discountAmount: number }> {
    return this.request('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    });
  }

  // Reports
  async getReports(): Promise<ReportsData> {
    return this.request('/reports');
  }

  // Settings
  async getSettings(): Promise<StoreSettingsData> {
    return this.request('/settings');
  }

  async updateSettings(data: StoreSettingsData): Promise<StoreSettingsData> {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Notifications
  async getNotifications(): Promise<NotificationData[]> {
    return this.request('/notifications');
  }

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsRead(): Promise<{ success: boolean }> {
    return this.request('/notifications/read-all', {
      method: 'PATCH',
    });
  }

  // Audit Logs
  async getAuditLogs(): Promise<AuditLogData[]> {
    return this.request('/audit-logs');
  }
}

export const api = new ApiService();
