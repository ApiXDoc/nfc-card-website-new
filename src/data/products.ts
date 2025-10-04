// Legacy Product interface for static data
interface LegacyProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  image: string;
  category: 'business' | 'personal' | 'premium';
  inStock: boolean;
  rating: number;
  reviews: number;
}

export const products: LegacyProduct[] = [
  {
    id: '1',
    name: 'Premium Black NFC Business Card',
    price: 29.99,
    originalPrice: 39.99,
    description: 'Sleek black NFC business card with instant contact sharing capability. Made from premium materials with a sophisticated matte finish.',
    features: [
      'Instant contact sharing',
      'Social media linking',
      'Professional matte finish',
      'Scratch resistant',
      'Compatible with all smartphones'
    ],
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=500&fit=crop',
    category: 'business',
    inStock: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    name: 'Gold Elite NFC Card',
    price: 49.99,
    originalPrice: 59.99,
    description: 'Luxury gold-plated NFC card for executives and professionals. Includes custom design and premium packaging.',
    features: [
      'Gold-plated finish',
      'Custom design service',
      'Premium gift box',
      'Lifetime warranty',
      'Advanced NFC chip'
    ],
    image: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=500&h=500&fit=crop',
    category: 'premium',
    inStock: true,
    rating: 4.9,
    reviews: 89
  },
  {
    id: '3',
    name: 'Personal Style NFC Card',
    price: 19.99,
    description: 'Perfect for personal use with customizable designs and colors. Great for sharing social profiles and contact info.',
    features: [
      'Multiple color options',
      'Social media integration',
      'Affordable pricing',
      'Easy to customize',
      'Durable construction'
    ],
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=500&fit=crop',
    category: 'personal',
    inStock: true,
    rating: 4.6,
    reviews: 156
  },
  {
    id: '4',
    name: 'Crystal Clear NFC Card',
    price: 34.99,
    description: 'Transparent acrylic NFC card with modern minimalist design. Perfect for creative professionals.',
    features: [
      'Crystal clear acrylic',
      'Minimalist design',
      'UV resistant',
      'Unique aesthetic',
      'Professional grade'
    ],
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&h=500&fit=crop',
    category: 'premium',
    inStock: true,
    rating: 4.7,
    reviews: 73
  },
  {
    id: '5',
    name: 'Wooden NFC Business Card',
    price: 39.99,
    description: 'Eco-friendly wooden NFC card made from sustainable bamboo. Natural finish with laser engraving.',
    features: [
      'Sustainable bamboo',
      'Laser engraved',
      'Eco-friendly',
      'Natural finish',
      'Unique texture'
    ],
    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=500&h=500&fit=crop',
    category: 'business',
    inStock: false,
    rating: 4.5,
    reviews: 67
  },
  {
    id: '6',
    name: 'Smart Metal NFC Card',
    price: 44.99,
    description: 'Brushed metal NFC card with smart features and app integration. Perfect for tech enthusiasts.',
    features: [
      'Brushed metal finish',
      'App integration',
      'Smart features',
      'Durable metal',
      'Tech enthusiast favorite'
    ],
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=500&h=500&fit=crop',
    category: 'premium',
    inStock: true,
    rating: 4.8,
    reviews: 95
  }
];
