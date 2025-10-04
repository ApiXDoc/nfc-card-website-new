export {}; // Module marker

import { get, post, put, del } from './api';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export const generalService = {
  async getCategories() {
    try {
      return await get('/endpoints/general.php/categories');
    } catch (error) {
      return { success: false, data: [], message: 'Failed' };
    }
  }
};

export const generalUtils = {
  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }
};
