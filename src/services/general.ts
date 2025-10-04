// General API Services - Categories, Settings, Shipping, etc.
import { get, post, put, del } from './api';

// Category interfaces
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sort_order: number;
  product_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sort_order?: number;
}

// Settings interfaces
export interface SiteSetting {
  setting_key: string;
  setting_value: string;
  setting_type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  is_public: boolean;
}

// Shipping interfaces
export interface ShippingMethod {
  id: number;
  name: string;
  description?: string;
  price: number;
  estimated_days_min: number;
  estimated_days_max: number;
  is_active: boolean;
  sort_order: number;
}

// Newsletter interfaces
export interface NewsletterSubscription {
  email: string;
  is_active?: boolean;
}

// Review interfaces
export interface ProductReview {
  id: number;
  product_id: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  review_text: string;
  is_approved: boolean;
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
  product_name?: string;
  product_slug?: string;
}

export interface CreateReviewRequest {
  product_id: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  review_text: string;
}

export interface ReviewFilters {
  product_id?: string;
  approved?: boolean;
  rating?: number;
  page?: number;
  limit?: number;
}

// Coupon interfaces
export interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimum_order_amount: number;
  maximum_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

export interface ValidateCouponRequest {
  code: string;
  order_total: number;
}

export interface ValidateCouponResponse {
  valid: boolean;
  discount_amount: number;
  coupon: Coupon;
  message?: string;
}

// Stats interfaces
export interface DashboardStats {
  total_products: number;
  total_orders: number;
  total_customers: number;
  total_revenue: number;
  pending_orders: number;
  recent_orders: any[];
  top_products: any[];
  revenue_chart: any[];
}

// Category Service
const categoryService = {
  // Get all categories
  async getCategories() {
    return get('/general.php/categories');
  },

  // Get single category
  async getCategory(categoryId: number) {
    return get(`/general.php/categories/${categoryId}`);
  },

  // Create category (admin only)
  async createCategory(categoryData: CreateCategoryRequest) {
    return post('/general.php/categories', categoryData);
  },

  // Update category (admin only)
  async updateCategory(categoryId: number, categoryData: Partial<CreateCategoryRequest>) {
    return put(`/general.php/categories/${categoryId}`, categoryData);
  },

  // Delete category (admin only)
  async deleteCategory(categoryId: number) {
    return del(`/general.php/categories/${categoryId}`);
  }
};

// Settings Service
const settingsService = {
  // Get all settings (public only for frontend)
  async getSettings(publicOnly: boolean = true) {
    return get(`/general.php/settings${publicOnly ? '?public=true' : ''}`);
  },

  // Get single setting
  async getSetting(key: string) {
    return get(`/general.php/settings/${key}`);
  },

  // Update setting (admin only)
  async updateSetting(key: string, value: string) {
    return put('/general.php/settings', {
      setting_key: key,
      setting_value: value
    });
  }
};

// Shipping Service
const shippingService = {
  // Get all shipping methods
  async getShippingMethods() {
    return get('/general.php/shipping');
  },

  // Create shipping method (admin only)
  async createShippingMethod(methodData: Omit<ShippingMethod, 'id'>) {
    return post('/general.php/shipping', methodData);
  },

  // Update shipping method (admin only)
  async updateShippingMethod(methodId: number, methodData: Partial<ShippingMethod>) {
    return put(`/general.php/shipping/${methodId}`, methodData);
  }
};

// Newsletter Service
const newsletterService = {
  // Subscribe to newsletter
  async subscribe(email: string) {
    return post('/general.php/newsletter/subscribe', { email });
  },

  // Unsubscribe from newsletter
  async unsubscribe(email: string) {
    return post('/general.php/newsletter/unsubscribe', { email });
  }
};

// Review Service
const reviewService = {
  // Get all reviews
  async getReviews(filters?: ReviewFilters) {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    return get(`/general.php/reviews${queryString ? `?${queryString}` : ''}`);
  },

  // Create review
  async createReview(reviewData: CreateReviewRequest) {
    return post('/general.php/reviews', reviewData);
  },

  // Update review (admin only)
  async updateReview(reviewId: number, reviewData: Partial<ProductReview>) {
    return put(`/general.php/reviews/${reviewId}`, reviewData);
  },

  // Approve review (admin only)
  async approveReview(reviewId: number) {
    return put(`/general.php/reviews/${reviewId}`, { is_approved: true });
  }
};

// Coupon Service
const couponService = {
  // Validate coupon
  async validateCoupon(code: string, orderTotal: number) {
    return post('/general.php/coupons/validate', {
      code,
      order_total: orderTotal
    });
  },

  // Get all coupons (admin only)
  async getCoupons() {
    return get('/general.php/coupons');
  },

  // Create coupon (admin only)
  async createCoupon(couponData: Omit<Coupon, 'id' | 'used_count'>) {
    return post('/general.php/coupons', couponData);
  }
};

// Stats Service
const statsService = {
  // Get dashboard stats (admin only)
  async getDashboardStats() {
    return get('/general.php/stats');
  },

  // Get specific stats
  async getStats(type: string) {
    return get(`/general.php/stats/${type}`);
  }
};

// General utilities
const generalUtils = {
  // Format currency
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  // Generate slug
  generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // Validate email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Format date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Format relative time
  formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  }
};

// Export all services
export {
  categoryService,
  settingsService,
  shippingService,
  newsletterService,
  reviewService,
  couponService,
  statsService,
  generalUtils
};
