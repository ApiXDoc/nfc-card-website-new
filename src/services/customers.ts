export {};

import { get, post, put, del } from './api';

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}

export const customerService = {
  async getCustomers() {
    return get('/customers.php');
  },
  
  async getCustomer(customerId: string) {
    return get(`/customers.php/${customerId}`);
  }
};

export default customerService;
