import api from './api';

export type FormStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

export interface FormListItem {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
  destination_country: string;
  educational_status: string;
  status: FormStatus;
  admin_response?: string;
  client_document?: string;
  createdAt: string;
  updatedAt: string;
  reviewed_at?: string;
  reviewed_by?: {
    _id: string;
    name: string;
    email: string;
  };
  telegram_user_name?: string;
  additional_information?: string;
}

export type UserForm = FormListItem;

export interface FormsListResponse {
  forms: FormListItem[];
  pagination: {
    totalPages: number;
    currentPage: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface GetFormsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: FormStatus;
  country?: string;
  educationStatus?: string;
}

interface RespondPayload {
  status: FormStatus;
  response: string;
}

export interface FormsDashboardStats {
  overview: {
    totalForms: number;
    pendingForms: number;
    inReviewForms: number;
    approvedForms: number;
    rejectedForms: number;
  };
  recentForms: Array<{
    _id: string;
    full_name: string;
    email: string;
    status: FormStatus;
    createdAt: string;
    destination_country?: string;
  }>;
  formsByCountry: Array<{ _id: string; count: number }>;
  formsByEducation: Array<{ _id: string; count: number }>;
}

export const formService = {
  async getForms(params: GetFormsParams = {}): Promise<FormsListResponse> {
    const { data } = await api.get('/forms', { params });
    return data;
  },

  async getForm(id: string): Promise<FormListItem> {
    const { data } = await api.get(`/forms/${id}`);
    return data;
  },

  async respondToForm(id: string, payload: RespondPayload) {
    const { data } = await api.put(`/forms/${id}/respond`, payload);
    return data;
  },

  async getMyForms(): Promise<UserForm[]> {
    const { data } = await api.get('/forms/my-forms');
    return data;
  },

  async getDashboardStats(): Promise<FormsDashboardStats> {
    const { data } = await api.get('/forms/dashboard-stats');
    return data;
  },

  async downloadDocument(id: string) {
    const response = await api.get(`/forms/${id}/download`, {
      responseType: 'blob',
    });
    return response;
  },
};
