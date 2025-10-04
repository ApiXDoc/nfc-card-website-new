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
  sku: string; // Made required to match types interface
  category_id: number;
  category_name: string; // Made required to match types interface
  category_slug: string; // Made required to match types interface
  stock_quantity: number;
  is_in_stock: boolean;
  in_stock?: boolean; // For compatibility
  is_active: number; // Changed to match types interface
  featured: boolean;
  is_featured?: boolean; // For compatibility
  weight?: string; // Changed to match types interface
  dimensions?: string;
  rating: number;
  total_reviews: number;
  review_count?: number; // For compatibility
  total_sales: number; // Made required to match types interface
  meta_title?: string;
  meta_description?: string;
  features: string[];
  images: ProductImage[];
  product_reviews?: ProductReview[]; // Renamed to avoid conflict
  tags?: string[];
  created_at: string;
  updated_at: string;
  // Required by main Product interface
  primary_image: string;
  image?: string; // For compatibility
  compare_price?: number; // For compatibility
  category?: 'business' | 'personal' | 'premium'; // For compatibility
  inStock?: boolean; // For compatibility
  reviews?: number; // For compatibility (review count)
  
  // New API response fields
  product_name?: string;
  product_mrp?: string | number;
  product_offer_price?: string | number;
  long_description?: string;
  product_feature_image?: string;
  product_gallery1?: string;
  product_gallery2?: string;
  product_gallery3?: string;
  product_gallery4?: string;
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
    params.append('action', 'read');
    
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
    return get(`/products.php?${queryString}`);
  },

  // Get featured products
  async getFeaturedProducts() {
    // Since the new API doesn't have a specific featured endpoint,
    // we'll get all products and let the frontend decide which ones to feature
    return get('/products.php?action=read&limit=6');
  },

  // Get single product by ID or slug
  async getProduct(identifier: string) {
    return get(`/products.php?action=read&id=${identifier}`);
  },

  // Search products
  async searchProducts(query: string, filters?: Omit<ProductFilters, 'search'>) {
    const params = new URLSearchParams();
    params.append('action', 'read');
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
    params.append('action', 'read');
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
    return post('/products.php?action=create', productData);
  },

  // Update product (admin only)
  async updateProduct(productId: string, productData: UpdateProductRequest) {
    return put(`/products.php?action=update&id=${productId}`, productData);
  },

  // Delete product (admin only)
  async deleteProduct(productId: string) {
    return del(`/products.php?action=delete&id=${productId}`);
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
    // Handle new API structure
    const productName = product.product_name || product.name || 'Unknown Product';
    const productMrp = parseFloat(product.product_mrp || product.original_price || product.compare_price || '0');
    const productOfferPrice = parseFloat(product.product_offer_price || product.price || product.sale_price || '0');
    
    // Get primary image from new API structure or fallback
    const primaryImage = product.product_feature_image 
      || product.images?.find((img: ProductImage) => img.is_primary)?.image_url 
      || product.images?.[0]?.image_url 
      || product.primary_image 
      || product.image 
      || '/images/placeholder.jpg';

    console.log('Product image fields:', {
      product_feature_image: product.product_feature_image,
      images: product.images,
      primary_image: product.primary_image,
      image: product.image,
      finalImage: primaryImage
    });

    // Create images array from new API gallery fields
    const galleryImages: ProductImage[] = [];
    if (product.product_feature_image) {
      galleryImages.push({
        image_url: product.product_feature_image,
        is_primary: true,
        alt_text: productName,
        sort_order: 0
      });
    }
    [product.product_gallery1, product.product_gallery2, product.product_gallery3, product.product_gallery4]
      .filter(Boolean)
      .forEach((url, index) => {
        galleryImages.push({
          image_url: url,
          is_primary: false,
          alt_text: `${productName} - Image ${index + 2}`,
          sort_order: index + 1
        });
      });

    return {
      ...product,
      // Map new API fields to existing structure
      id: product.id?.toString() || Math.random().toString(),
      name: productName,
      slug: product.slug || productName.toLowerCase().replace(/\s+/g, '-'),
      description: product.long_description || product.description || product.short_description || '',
      short_description: product.short_description || '',
      price: productOfferPrice,
      original_price: productMrp > productOfferPrice ? productMrp : undefined,
      
      // Normalize boolean fields
      is_in_stock: product.is_in_stock !== undefined ? product.is_in_stock : (product.in_stock !== undefined ? product.in_stock : true),
      in_stock: product.is_in_stock !== undefined ? product.is_in_stock : (product.in_stock !== undefined ? product.in_stock : true),
      featured: product.featured || product.is_featured || false,
      is_featured: product.featured || product.is_featured || false,
      
      // Price fields
      sale_price: productMrp && productOfferPrice < productMrp ? productOfferPrice : undefined,
      compare_price: productMrp > productOfferPrice ? productMrp : undefined,
      
      // Review and rating fields
      rating: product.rating || 4.5, // Default rating
      total_reviews: product.total_reviews || product.review_count || 0,
      review_count: product.total_reviews || product.review_count || 0,
      reviews: product.total_reviews || product.review_count || 0,
      
      // Required fields with defaults
      primary_image: primaryImage,
      image: primaryImage, // For compatibility
      sku: product.sku || `SKU-${product.id}`,
      category_id: product.category_id || 1,
      category_name: product.category_name || 'NFC Cards',
      category_slug: product.category_slug || 'nfc-cards',
      stock_quantity: product.stock_quantity || 100,
      is_active: product.is_active !== undefined ? product.is_active : 1,
      total_sales: product.total_sales || 0,
      weight: product.weight || '',
      dimensions: product.dimensions || '',
      category: product.category || 'business',
      inStock: product.is_in_stock !== undefined ? product.is_in_stock : (product.in_stock !== undefined ? product.in_stock : true),
      
      // Ensure arrays exist
      features: product.features || [],
      images: galleryImages.length > 0 ? galleryImages : (product.images || []),
      tags: product.tags || [],
      
      // Timestamps
      created_at: product.created_at || new Date().toISOString(),
      updated_at: product.updated_at || new Date().toISOString()
    };
  }
};

// Export default
export default productService;
