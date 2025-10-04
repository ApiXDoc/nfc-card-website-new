// Contact and FAQ API Services
import { get, post, put, del, ApiResponse, PaginationData } from './api';

// FAQ interfaces
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQByCategory {
  [category: string]: FAQ[];
}

// Contact interfaces
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: 'general' | 'sales' | 'support' | 'technical' | 'billing';
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SubmitContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type?: 'general' | 'sales' | 'support' | 'technical' | 'billing';
}

export interface ContactFilters {
  status?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// FAQ API functions
export const faqService = {
  // Get all FAQs grouped by category
  async getFAQs(): Promise<ApiResponse<FAQByCategory>> {
    return get<FAQByCategory>('/faq');
  },

  // Get FAQs by category
  async getFAQsByCategory(category: string): Promise<ApiResponse<FAQ[]>> {
    return get<FAQ[]>(`/faq?category=${encodeURIComponent(category)}`);
  },

  // Search FAQs
  async searchFAQs(query: string): Promise<ApiResponse<FAQ[]>> {
    return get<FAQ[]>(`/faq?search=${encodeURIComponent(query)}`);
  },

  // Get single FAQ
  async getFAQ(id: string): Promise<ApiResponse<FAQ>> {
    return get<FAQ>(`/faq/${id}`);
  },

  // Create FAQ (admin)
  async createFAQ(faqData: Partial<FAQ>): Promise<ApiResponse<FAQ>> {
    return post<FAQ>('/faq', faqData);
  },

  // Update FAQ (admin)
  async updateFAQ(id: string, faqData: Partial<FAQ>): Promise<ApiResponse<FAQ>> {
    return put<FAQ>(`/faq/${id}`, faqData);
  },

  // Delete FAQ (admin)
  async deleteFAQ(id: string): Promise<ApiResponse> {
    return del(`/faq/${id}`);
  }
};

// Contact API functions
export const contactService = {
  // Submit contact message
  async submitMessage(messageData: SubmitContactRequest): Promise<ApiResponse<ContactMessage>> {
    return post<ContactMessage>('/contact', messageData);
  },

  // Get all contact messages (admin)
  async getMessages(filters: ContactFilters = {}): Promise<ApiResponse<PaginationData<ContactMessage>>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/contact?${queryString}` : '/contact';
    
    return get<PaginationData<ContactMessage>>(endpoint);
  },

  // Get single contact message (admin)
  async getMessage(id: string): Promise<ApiResponse<ContactMessage>> {
    return get<ContactMessage>(`/contact/${id}`);
  },

  // Update message status (admin)
  async updateMessageStatus(id: string, status: string, adminNotes?: string): Promise<ApiResponse<ContactMessage>> {
    const updateData: any = { status };
    if (adminNotes) {
      updateData.admin_notes = adminNotes;
    }
    return put<ContactMessage>(`/contact/${id}`, updateData);
  },

  // Delete message (admin)
  async deleteMessage(id: string): Promise<ApiResponse> {
    return del(`/contact/${id}`);
  }
};
