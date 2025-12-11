import { Testimonial } from "@/types/testimonial";

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const response = await fetch('/api/testimonials');
  if (!response.ok) {
    throw new Error('Failed to fetch testimonials');
  }
  return response.json();
};

export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  const response = await fetch('/api/testimonials/all', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch all testimonials');
  }
  return response.json();
};

export const createTestimonial = async (data: FormData): Promise<Testimonial> => {
  const response = await fetch('/api/testimonials', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: data,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create testimonial');
  }
  return response.json();
};

export const updateTestimonial = async (id: string, data: FormData): Promise<Testimonial> => {
  const response = await fetch(`/api/testimonials/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: data,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update testimonial');
  }
  return response.json();
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  const response = await fetch(`/api/testimonials/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete testimonial');
  }
};

export const toggleTestimonialStatus = async (id: string): Promise<{ isActive: boolean }> => {
  const response = await fetch(`/api/testimonials/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update testimonial status');
  }
  return response.json();
};
