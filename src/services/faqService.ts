import api from './api';

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getFAQs = async (): Promise<FAQ[]> => {
  try {
    const response = await api.get('/faqs');
    return response.data;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    throw error;
  }
};

export const getFAQById = async (id: string): Promise<FAQ> => {
  try {
    const response = await api.get(`/faqs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching FAQ with ID ${id}:`, error);
    throw error;
  }
};

export const createFAQ = async (faqData: Omit<FAQ, '_id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const response = await api.post('/faqs', faqData);
    return response.data;
  } catch (error) {
    console.error('Error creating FAQ:', error);
    throw error;
  }
};

export const updateFAQ = async (id: string, faqData: Partial<FAQ>) => {
  try {
    const response = await api.put(`/faqs/${id}`, faqData);
    return response.data;
  } catch (error) {
    console.error(`Error updating FAQ with ID ${id}:`, error);
    throw error;
  }
};

export const deleteFAQ = async (id: string) => {
  try {
    const response = await api.delete(`/faqs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting FAQ with ID ${id}:`, error);
    throw error;
  }
};
