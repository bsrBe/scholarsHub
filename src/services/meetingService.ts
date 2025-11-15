import { meetingApi } from './api';

export interface Meeting {
  _id: string;
  title: string;
  startTime: string;
  status: string;
  jitsiMeetingLink: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

interface CreateMeetingData {
  title: string;
  description?: string;
  hostName: string;
  hostEmail: string;
  participants?: string[];
  startTime: string; // ISO
  endTime: string;   // ISO
  timeZone: string;
}
type UpdateMeetingData = Partial<CreateMeetingData> & { status?: string };

export const MeetingService = {
  // Get all meetings
  async getAllMeetings(params?: Record<string, any>) {
    try {
      const response = await meetingApi.getMeetings(params);
      return response.data; // { items, total, page, limit } or array in older API
    } catch (error) {
      console.error('Error fetching meetings:', error);
      throw error;
    }
  },

  // Create a new meeting
  async createMeeting(meetingData: CreateMeetingData) {
    try {
      const response = await meetingApi.createMeeting(meetingData);
      return response.data;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  },
  async updateMeeting(id: string, updates: UpdateMeetingData) {
    try {
      const response = await meetingApi.updateMeeting(id, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error;
    }
  },
  async deleteMeeting(id: string) {
    try {
      const response = await meetingApi.deleteMeeting(id);
      return response.data;
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  },

  // Get a single meeting by ID
  async getMeetingById(id: string) {
    try {
      const response = await meetingApi.getMeetingById(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching meeting ${id}:`, error);
      throw error;
    }
  },

  // Join a meeting
  async joinMeeting(meetingId: string, displayName: string = '') {
    try {
      const response = await meetingApi.joinMeeting(meetingId, displayName);
      return response.data;
    } catch (error) {
      console.error('Error joining meeting:', error);
      throw error;
    }
  },

  // Format meeting time for display
  formatMeetingTime(dateString: string) {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  },

  // Check if a meeting can be joined (within 15 minutes of start time)
  canJoinMeeting(startTime: string): { canJoin: boolean; message: string } {
    try {
      const start = new Date(startTime);
      const now = new Date();
      const fifteenMinutesBefore = new Date(start.getTime() - 15 * 60 * 1000);
      
      if (now < fifteenMinutesBefore) {
        return {
          canJoin: false,
          message: `Meeting will be available at ${fifteenMinutesBefore.toLocaleTimeString()}`,
        };
      }
      
      return { canJoin: true, message: 'You can join the meeting now' };
    } catch (e) {
      console.error('Error checking meeting time:', e);
      return { canJoin: false, message: 'Error checking meeting availability' };
    }
  },
};

// Complete a meeting
const completeMeeting = async (meetingId: string) => {
  try {
    const response = await meetingApi.updateMeeting(meetingId, { status: 'completed' });
    return response.data;
  } catch (error) {
    console.error('Error completing meeting:', error);
    throw error;
  }
};

export default MeetingService;

export { completeMeeting };
