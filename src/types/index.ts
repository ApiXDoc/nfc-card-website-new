export interface ProductImage {
  id?: number;
  image_url: string;
  alt_text?: string;
  sort_order?: number;
  is_primary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  original_price?: number;
  sku: string; // Made required to match services
  category_id: number;
  stock_quantity: number;
  is_in_stock: boolean;
  is_active: number;
  weight?: string;
  dimensions?: string;
  rating: number;
  total_reviews: number;
  total_sales: number;
  meta_title?: string;
  meta_description?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  category_name: string;
  category_slug: string;
  primary_image: string;
  features: string[];
  images?: ProductImage[];
  // Legacy compatibility properties
  originalPrice?: number;
  image?: string;
  category?: 'business' | 'personal' | 'premium';
  inStock?: boolean;
  reviews?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface Order {
  id: string;
  customer: Customer;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
}
