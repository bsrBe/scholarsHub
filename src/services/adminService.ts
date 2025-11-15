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
//       const response = await api.get('/admin/meetings');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching meetings:', error);
//       throw error;
//     }
//   },

//   // Update meeting status
//   async updateMeetingStatus(meetingId: string, status: string): Promise<Meeting> {
//     try {
//       const response = await api.put(`/admin/meetings/${meetingId}/status`, { status });
//       return response.data;
//     } catch (error) {
//       console.error('Error updating meeting status:', error);
//       throw error;
//     }
//   },

//   // Get all users
//   async getAllUsers(): Promise<User[]> {
//     try {
//       const response = await api.get('/admin/users');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       throw error;
//     }
//   },

//   // Update user role
//   async updateUserRole(userId: string, role: string): Promise<User> {
//     try {
//       const response = await api.put(`/admin/users/${userId}/role`, { role });
//       return response.data;
//     } catch (error) {
//       console.error('Error updating user role:', error);
//       throw error;
//     }
//   },

//   // Get system statistics
//   async getStats(): Promise<Stats> {
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
  // Users (admin-only)
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
  }
};

export default adminService;