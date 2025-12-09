// import api from './api';

// interface Meeting {
//   _id: string;
//   title: string;
//   startTime: string;
//   endTime: string;
//   status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
//   user?: {
//     _id: string;
//     name: string;
//     email: string;
//   };
// }

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: 'user' | 'admin' | 'consultant';
//   createdAt: string;
// }

// interface Stats {
//   totalUsers: number;
//   totalMeetings: number;
//   meetingsByStatus: {
//     [key: string]: number;
//   };
// }

// const adminService = {
//   // Get all meetings (admin view)
//   async getAllMeetings(): Promise<Meeting[]> {
//     try {
//       const response = await api.get('/admin/stats');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//       throw error;
//     }
//   },
// };

// export default adminService;
// Update adminService.ts
import api from './api';

export interface AdminStats {
  totals: { users: number; meetings: number; forms: number };
  meetingsByStatus: { scheduled: number; completed: number; cancelled: number };
  last7Days: { users: number; meetings: number; forms: number };
  last30Days: { users: number; meetings: number; forms: number };
}

export interface ActivityItem {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  actor?: { _id: string; name: string; email: string; role: string };
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  profileImageUrl?: string;
  createdAt: string;
}

const adminService = {
  // Dashboard
  async getOverview(): Promise<{ stats: AdminStats; activities: ActivityItem[] }> {
    const { data } = await api.get('/admin/overview');
    return data;
  },
  
  async getStats(): Promise<AdminStats> {
    const { data } = await api.get('/admin/stats');
    return data;
  },
  
  async getRecentActivities(limit = 20): Promise<ActivityItem[]> {
    const { data } = await api.get('/admin/activities', { params: { limit } });
    return data;
  },
  
  // User Management
  async getUsers(params?: { search?: string; role?: string; page?: number; limit?: number }):
    Promise<{ items: UserItem[]; total: number; page: number; limit: number }> {
    const { data } = await api.get('/users', { params });
    return data;
  },
  
  async getUser(userId: string): Promise<UserItem> {
    const { data } = await api.get(`/users/${userId}`);
    return data;
  },
  
  async updateUser(userId: string, updates: Partial<UserItem>): Promise<UserItem> {
    const { data } = await api.patch(`/users/${userId}`, updates);
    return data;
  },
  
  async deleteUser(userId: string): Promise<{ success: boolean }> {
    const { data } = await api.delete(`/users/${userId}`);
    return data;
  },
  
  // Password Management
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data } = await api.put('/admin/change-password', {
        currentPassword,
        password: newPassword
      });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to change password');
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data } = await api.post('/admin/forgot-password', { email });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to process password reset request');
    }
  },

  async resetPassword(token: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data } = await api.put(`/admin/reset-password/${token}`, { 
        password 
      });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reset password');
    }
  }
};

export default adminService;