import { get, post, put } from './api';

export interface Order {
  id: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface CreateOrderRequest {
  name: string;
  email: string;
  phone: string;
  shipping_address: string;
  total_amount: number;
  order_data: string;
  order_status: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
}

export const orderService = {
  async getOrders() {
    return get('/orders.php');
  },
  
  async getOrder(orderId: string) {
    return get(`/orders.php/${orderId}`);
  },

  async createOrder(orderData: CreateOrderRequest) {
    return post<CreateOrderResponse>('/orders.php?action=create', orderData);
  }
};

export default orderService;
