import { get, post, put, del } from './api';

// Support/Contact Interfaces
export interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  order_number?: string;
  category: 'general' | 'support' | 'billing' | 'technical' | 'complaint' | 'suggestion';
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: number;
  internal_notes?: string;
  response?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  order_number?: string;
  category: ContactMessage['category'];
}

export interface UpdateContactRequest {
  status?: ContactMessage['status'];
  priority?: ContactMessage['priority'];
  assigned_to?: number;
  internal_notes?: string;
  response?: string;
}

export interface CreateFAQRequest {
  category: string;
  question: string;
  answer: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateFAQRequest {
  category?: string;
  question?: string;
  answer?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface SupportFilters {
  status?: string;
  category?: string;
  priority?: string;
  assigned_to?: number;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

export interface FAQFilters {
  category?: string;
  is_active?: boolean;
  search?: string;
}

// API Response type
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Support Service
export const supportService = {
  // Contact Messages
  async getContactMessages(filters?: SupportFilters): Promise<ApiResponse<{
    messages: ContactMessage[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_records: number;
      per_page: number;
    };
  }>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    return get(`/endpoints/support.php/contact${queryString ? `?${queryString}` : ''}`);
  },

  // Get single contact message
  async getContactMessage(messageId: number): Promise<ApiResponse<ContactMessage>> {
    return get(`/endpoints/support.php/contact/${messageId}`);
  },

  // Create new contact message
  async createContactMessage(messageData: CreateContactRequest): Promise<ApiResponse<ContactMessage>> {
    return post('/endpoints/support.php/contact', messageData);
  },

  // Update contact message (admin only)
  async updateContactMessage(messageId: number, updateData: UpdateContactRequest): Promise<ApiResponse<ContactMessage>> {
    return put(`/endpoints/support.php/contact/${messageId}`, updateData);
  },

  // Delete contact message (admin only)
  async deleteContactMessage(messageId: number): Promise<ApiResponse<any>> {
    return del(`/endpoints/support.php/contact/${messageId}`);
  },

  // FAQ Management
  async getFAQs(filters?: FAQFilters): Promise<ApiResponse<FAQ[]>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    return get(`/endpoints/support.php/faq${queryString ? `?${queryString}` : ''}`);
  },

  // Get single FAQ
  async getFAQ(faqId: number): Promise<ApiResponse<FAQ>> {
    return get(`/endpoints/support.php/faq/${faqId}`);
  },

  // Create new FAQ (admin only)
  async createFAQ(faqData: CreateFAQRequest): Promise<ApiResponse<FAQ>> {
    return post('/endpoints/support.php/faq', faqData);
  },

  // Update FAQ (admin only)
  async updateFAQ(faqId: number, updateData: UpdateFAQRequest): Promise<ApiResponse<FAQ>> {
    return put(`/endpoints/support.php/faq/${faqId}`, updateData);
  },

  // Delete FAQ (admin only)
  async deleteFAQ(faqId: number): Promise<ApiResponse<any>> {
    return del(`/endpoints/support.php/faq/${faqId}`);
  },

  // Get FAQ categories
  async getFAQCategories(): Promise<ApiResponse<string[]>> {
    return get('/endpoints/support.php/faq/categories');
  },

  // Get support statistics (admin only)
  async getSupportStats(): Promise<ApiResponse<{
    total_messages: number;
    new_messages: number;
    in_progress_messages: number;
    resolved_messages: number;
    average_response_time: number;
    messages_by_category: Record<string, number>;
    messages_by_priority: Record<string, number>;
  }>> {
    return get('/endpoints/support.php/stats');
  }
};

// Support utilities
export const supportUtils = {
  // Get status color
  getStatusColor(status: ContactMessage['status']): string {
    switch (status) {
      case 'new': return '#fbbf24';
      case 'in_progress': return '#3b82f6';
      case 'resolved': return '#10b981';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  },

  // Get priority color
  getPriorityColor(priority: ContactMessage['priority']): string {
    switch (priority) {
      case 'low': return '#10b981';
      case 'medium': return '#fbbf24';
      case 'high': return '#f97316';
      case 'urgent': return '#ef4444';
      default: return '#6b7280';
    }
  },

  // Get category display name
  getCategoryDisplayName(category: ContactMessage['category']): string {
    switch (category) {
      case 'general': return 'General Inquiry';
      case 'support': return 'Technical Support';
      case 'billing': return 'Billing & Payment';
      case 'technical': return 'Technical Issue';
      case 'complaint': return 'Complaint';
      case 'suggestion': return 'Suggestion';
      default: return category;
    }
  },

  // Format FAQ for display
  formatFAQForDisplay(faq: FAQ): { category: string; question: string; answer: string } {
    return {
      category: faq.category.charAt(0).toUpperCase() + faq.category.slice(1),
      question: faq.question,
      answer: faq.answer
    };
  },

  // Validate contact form
  validateContactForm(data: CreateContactRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!data.email || !data.email.includes('@')) {
      errors.push('Valid email address is required');
    }

    if (!data.subject || data.subject.trim().length < 5) {
      errors.push('Subject must be at least 5 characters long');
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    }

    if (data.phone && data.phone.length > 0 && data.phone.length < 10) {
      errors.push('Phone number must be at least 10 digits');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
