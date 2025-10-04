// API Service for NFC Card Store
// Base URL: https://anfopublicationhouse.com/api/endpoints/

export const API_BASE_URL = 'https://anfopublicationhouse.com/api/endpoints';

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// Pagination interface
export interface PaginationData<T> {
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    per_page: number;
    total_items: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Generic API request function
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ApiResponse<T> = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// GET request
export async function get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint);
}

// POST request
export async function post<T = any>(
  endpoint: string,
  data: any
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// PUT request
export async function put<T = any>(
  endpoint: string,
  data: any
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// DELETE request
export async function del<T = any>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
  });
}

// Health check
export async function healthCheck(): Promise<ApiResponse> {
  return get('/health');
}

// Test API connection
export async function testConnection(): Promise<boolean> {
  try {
    const response = await get('/');
    return response.success;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}
