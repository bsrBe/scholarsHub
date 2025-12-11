// Testimonial service for admin operations
import api from './api';

export interface Testimonial {
  _id: string;
  name: string;
  country: string;
  university: string;
  message: string;
  rating: number;
  image?: { url: string; public_id?: string };
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Public fetch (active testimonials)
export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const response = await api.get('/testimonials');
    return response.data;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};

// Admin: fetch all testimonials
export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const response = await api.get('/testimonials/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all testimonials:', error);
    throw error;
  }
};

export const createTestimonial = async (data: FormData) => {
  try {
    const response = await api.post('/testimonials', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
};

export const updateTestimonial = async (id: string, data: FormData) => {
  try {
    const response = await api.put(`/testimonials/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

export const deleteTestimonial = async (id: string) => {
  try {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
};

export const toggleTestimonialStatus = async (id: string) => {
  try {
    const response = await api.patch(`/testimonials/${id}/status`);
    return response.data;
  } catch (error) {
    console.error('Error toggling testimonial status:', error);
    throw error;
  }
};
