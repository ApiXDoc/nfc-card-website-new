import { Category } from './services/general';

// Test what TypeScript thinks Category interface is
const testCategory: Category = {
  id: 1,
  name: 'Test',
  slug: 'test',
  sort_order: 1,
  is_active: true,
  product_count: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

console.log(testCategory);
