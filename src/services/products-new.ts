import { get, post, put, del } from './api';

// Product Interfaces matching backend API
export interface ProductImage {
  id?: number;
  image_url: string;
  url?: string; // For compatibility
  alt_text?: string;
  sort_order?: number;
  is_primary: boolean;
}

export interface ProductReview {
  id: number;
  customer_name: string;
  customer_email: string;
  rating: number;
  review_text: string;
  is_verified: boolean;
  helpful_count: number;
  review_date: string;
  is_approved: boolean;
}

export interface Product {
  id: string; // Backend uses UUID strings
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  original_price?: number;
  sale_price?: number; // For compatibility
  sku?: string;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  stock_quantity: number;
  is_in_stock: boolean;
  in_stock?: boolean; // For compatibility
  is_active: boolean;
  featured: boolean;
  is_featured?: boolean; // For compatibility
  weight?: number;
  dimensions?: string;
  rating: number;
  total_reviews: number;
  review_count?: number; // For compatibility
  total_sales?: number;
  meta_title?: string;
  meta_description?: string;
  features: string[];
  images: ProductImage[];
  reviews?: ProductReview[];
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  featured?: boolean;
  in_stock?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'name' | 'price' | 'created_at' | 'rating' | 'featured' | 'total_sales';
  order?: 'ASC' | 'DESC';
}

export interface CreateProductRequest {
  name: string;
  description: string;
  short_description?: string;
  price: number;
  original_price?: number;
  sku?: string;
  category_id: number;
  stock_quantity?: number;
  is_in_stock?: boolean;
  weight?: number;
  dimensions?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  is_active?: boolean;
}

// Product Service
export const productService = {
  // Get all products with filters
  async getProducts(filters?: ProductFilters) {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const queryString = params.toString();
    return get(`/products.php${queryString ? `?${queryString}` : ''}`);
  },

  // Get featured products
  async getFeaturedProducts() {
    return get('/products.php?featured=true&limit=6');
  },

  // Get single product by ID or slug
  async getProduct(identifier: string) {
    return get(`/products.php/${identifier}`);
  },

  // Search products
  async searchProducts(query: string, filters?: Omit<ProductFilters, 'search'>) {
    const params = new URLSearchParams();
    params.append('search', query);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    return get(`/products.php?${params.toString()}`);
  },

  // Get products by category
  async getProductsByCategory(categoryId: number, filters?: Omit<ProductFilters, 'category'>) {
    const params = new URLSearchParams();
    params.append('category', categoryId.toString());
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    return get(`/products.php?${params.toString()}`);
  },

  // Create new product (admin only)
  async createProduct(productData: CreateProductRequest) {
    return post('/products.php', productData);
  },

  // Update product (admin only)
  async updateProduct(productId: string, productData: UpdateProductRequest) {
    return put(`/products.php/${productId}`, productData);
  },

  // Delete product (admin only)
  async deleteProduct(productId: string) {
    return del(`/products.php/${productId}`);
  }
};

// Product utilities
export const productUtils = {
  // Format price
  formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  },

  // Calculate discount percentage
  calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
    if (!salePrice || salePrice >= originalPrice) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  },

  // Check if product is on sale
  isOnSale(product: Product): boolean {
    return !!(product.original_price && product.price < product.original_price);
  },

  // Get primary image
  getPrimaryImage(product: Product): ProductImage | undefined {
    return product.images?.find(img => img.is_primary) || product.images?.[0];
  },

  // Check stock status
  getStockStatus(quantity: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
    if (quantity === 0) return 'out_of_stock';
    if (quantity <= 5) return 'low_stock';
    return 'in_stock';
  },

  // Get stock status color
  getStockStatusColor(status: string): string {
    switch (status) {
      case 'in_stock': return '#10b981';
      case 'low_stock': return '#fbbf24';
      case 'out_of_stock': return '#ef4444';
      default: return '#6b7280';
    }
  },

  // Convert backend product to frontend format
  normalizeProduct(product: any): Product {
    return {
      ...product,
      // Normalize boolean fields
      is_in_stock: product.is_in_stock || product.in_stock || false,
      in_stock: product.is_in_stock || product.in_stock || false,
      featured: product.featured || product.is_featured || false,
      is_featured: product.featured || product.is_featured || false,
      // Normalize price fields
      sale_price: product.original_price && product.price < product.original_price ? product.price : undefined,
      // Normalize review count
      review_count: product.total_reviews || product.review_count || 0,
      // Ensure arrays exist
      features: product.features || [],
      images: product.images || [],
      reviews: product.reviews || [],
      tags: product.tags || []
    };
  }
};

// Export default
export default productService;
