import api from './api';
import type { AxiosError } from 'axios';

interface ChatMessage {
  _id: string;
  from: 'user' | 'admin';
  message: string;
  userId: string;
  sent_at: string;
  read_at?: string;
  user?: {
    name: string;
    email: string;
    profileImageUrl?: string;
  };
}

interface ChatResponse {
  success: boolean;
  messages: ChatMessage[];
}

interface SendMessageResponse {
  success: boolean;
  message: string;
  data: ChatMessage;
}

type ErrorResponseData = {
  message?: string;
  msg?: string;
};

const isAxiosError = (error: unknown): error is AxiosError<ErrorResponseData> => {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
};

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    return error.response?.data?.message 
      ?? error.response?.data?.msg 
      ?? error.message 
      ?? fallback;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
};

export const chatService = {
  // Get user's chat messages
  async getUserMessages(): Promise<ChatMessage[]> {
    try {
      const response = await api.get<ChatResponse>('/chat/user-messages');
      return response.data.messages;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, 'Failed to fetch messages'));
    }
  },

  // Send a message
  async sendMessage(message: string): Promise<SendMessageResponse> {
    try {
      const response = await api.post<SendMessageResponse>('/chat/send', { message });
      return response.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, 'Failed to send message'));
    }
  },

  // Admin: Get all messages
  async getAllMessages(): Promise<ChatMessage[]> {
    try {
      const response = await api.get<ChatResponse>('/chat/all-messages');
      return response.data.messages;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, 'Failed to fetch messages'));
    }
  },

  // Admin: Send a message
  async adminSendMessage(message: string, userId: string): Promise<SendMessageResponse> {
    try {
      const response = await api.post<SendMessageResponse>('/chat/admin-send', { message, userId });
      return response.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, 'Failed to send message'));
    }
  },

  // Admin: Mark messages as read
  async markAsRead(messageIds: string[]): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/chat/mark-read', { messageIds });
      return response.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, 'Failed to mark messages as read'));
    }
  },

  // Admin: Get unread count
  async getUnreadCount(): Promise<{ success: boolean; unreadCount: number }> {
    try {
      const response = await api.get('/chat/unread-count');
      return response.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, 'Failed to get unread count'));
    }
  }
};

export type { ChatMessage };
