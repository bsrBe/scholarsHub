import api from './api';

export const jitsiService = {
  // Generate a Jitsi JWT token for authenticated users
  generateJitsiToken: async (roomName: string, userData: {
    id: string;
    email: string;
    name: string;
    role?: string;
  }) => {
    const response = await api.post('/jitsi/generate-token', {
      roomName,
      user: userData,
    });
    return response.data;
  },

  // Get Jitsi configuration
  getJitsiConfig: async () => {
    const response = await api.get('/jitsi/config');
    return response.data;
  },

  // Create a protected meeting room
  createProtectedMeeting: async (meetingData: {
    title: string;
    startTime: Date;
    participants?: string[];
  }) => {
    const response = await api.post('/meetings/protected', meetingData);
    return response.data;
  },

  // Join a protected meeting
  joinProtectedMeeting: async (meetingId: string) => {
    const response = await api.get(`/meetings/${meetingId}/join-protected`);
    return response.data;
  },
};
