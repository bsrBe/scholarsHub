import api from './api';

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  thumbnail?: string;
  author?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  tags?: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await api.get('/articles');
    return response.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

export const getBlogPost = async (id: string): Promise<BlogPost> => {
  try {
    console.log(`Fetching blog post from: /articles/${id}`);
    const apiBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    // Make a raw fetch request to bypass any axios interceptors that might be causing issues
    const response = await fetch(`${apiBaseURL}/articles/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    console.log('Raw fetch response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response data:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Parsed response data:', data);
    
    if (!data) {
      throw new Error('No data received from server');
    }
    
    // Ensure the response matches our BlogPost interface
    const blogPost: BlogPost = {
      _id: data._id,
      title: data.title,
      slug: data.slug || data._id, // Fallback to _id if slug is not provided
      content: data.content || '',
      excerpt: data.excerpt || '',
      category: data.category || 'Uncategorized',
      thumbnail: data.thumbnail,
      isPublished: data.isPublished !== false, // Default to true if not specified
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
    
    if (data.author) {
      blogPost.author = {
        _id: data.author._id || 'unknown',
        name: data.author.name || 'Unknown Author',
        avatar: data.author.avatar,
      };
    }
    
    if (data.tags) {
      blogPost.tags = Array.isArray(data.tags) ? data.tags : [];
    }
    
    return blogPost;
  } catch (error) {
    console.error(`Error in getBlogPost for ID ${id}:`, error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
};

export const createBlogPost = async (postData: FormData) => {
  try {
    const response = await api.post('/articles', postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

export const updateBlogPost = async (id: string, postData: FormData) => {
  try {
    const response = await api.put(`/articles/${id}`, postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating blog post with ID ${id}:`, error);
    throw error;
  }
};

export const deleteBlogPost = async (id: string) => {
  try {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting blog post with ID ${id}:`, error);
    throw error;
  }
};
