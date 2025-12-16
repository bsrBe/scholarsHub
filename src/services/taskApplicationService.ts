import api from './api';

export type ApplicantType = 'undergraduate' | 'masters' | 'phd';
export type TaskApplicationStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

export interface TaskApplication {
  _id: string;
  user_id?: {
    _id: string;
    name: string;
    email: string;
  };
  applicant_type: ApplicantType;
  passport: string;
  national_identity_card?: string;
  highschool_certificates: string;
  transcripts: string;
  recommendation_letter_1: string;
  recommendation_letter_2: string;
  student_cv_resume: string;
  statement_of_purpose: string;
  birth_certificate: string;
  english_proficiency?: string;
  recommendation_letter_3?: string;
  bachelors_degree_certificate?: string;
  bachelors_degree_transcript?: string;
  diploma?: string;
  thesis?: string;
  additional_documents_pdf?: string[];
  additional_documents_images?: string[];
  status: TaskApplicationStatus;
  admin_response?: string;
  reviewed_at?: string;
  reviewed_by?: {
    _id: string;
    name: string;
    email: string;
  };
  messages: Array<{
    _id: string;
    from: 'user' | 'admin';
    message: string;
    sent_at: string;
    sent_by: {
      _id: string;
      name: string;
      email: string;
      role?: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface TaskApplicationsListResponse {
  items: TaskApplication[];
  total: number;
  page: number;
  limit: number;
}

interface CreateTaskApplicationPayload {
  applicant_type: ApplicantType;
  passport: File;
  national_identity_card?: File;
  highschool_certificates: File;
  transcripts: File;
  recommendation_letter_1: File;
  recommendation_letter_2: File;
  student_cv_resume: File;
  statement_of_purpose: File;
  birth_certificate: File;
  english_proficiency?: File;
  recommendation_letter_3?: File;
  bachelors_degree_certificate?: File;
  bachelors_degree_transcript?: File;
  diploma?: File;
  thesis?: File;
}

interface RespondPayload {
  status: TaskApplicationStatus;
  response: string;
}

export const taskApplicationService = {
  async createTaskApplication(payload: CreateTaskApplicationPayload) {
    const formData = new FormData();
    formData.append('applicant_type', payload.applicant_type);
    
    // Append all files
    formData.append('passport', payload.passport);
    if (payload.national_identity_card) formData.append('national_identity_card', payload.national_identity_card);
    formData.append('highschool_certificates', payload.highschool_certificates);
    formData.append('transcripts', payload.transcripts);
    formData.append('recommendation_letter_1', payload.recommendation_letter_1);
    formData.append('recommendation_letter_2', payload.recommendation_letter_2);
    formData.append('student_cv_resume', payload.student_cv_resume);
    formData.append('statement_of_purpose', payload.statement_of_purpose);
    formData.append('birth_certificate', payload.birth_certificate);
    if (payload.english_proficiency) formData.append('english_proficiency', payload.english_proficiency);
    if (payload.recommendation_letter_3) formData.append('recommendation_letter_3', payload.recommendation_letter_3);
    if (payload.bachelors_degree_certificate) formData.append('bachelors_degree_certificate', payload.bachelors_degree_certificate);
    if (payload.bachelors_degree_transcript) formData.append('bachelors_degree_transcript', payload.bachelors_degree_transcript);
    if (payload.diploma) formData.append('diploma', payload.diploma);
    if (payload.thesis) formData.append('thesis', payload.thesis);

    const { data } = await api.post('/task-applications', formData, {
      // Don't set Content-Type header - axios will set it automatically with boundary for FormData
      timeout: 120000, // 2 minutes timeout for file uploads
    });
    return data;
  },

  async getMyTaskApplications(): Promise<TaskApplication[]> {
    const { data } = await api.get('/task-applications/my-applications');
    return data;
  },

  async getTaskApplication(id: string): Promise<TaskApplication> {
    const { data } = await api.get(`/task-applications/${id}`);
    return data;
  },

  async getAllTaskApplications(params?: {
    status?: TaskApplicationStatus;
    applicant_type?: ApplicantType;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<TaskApplicationsListResponse> {
    const { data } = await api.get('/task-applications', { params });
    return data;
  },

  async respondToTaskApplication(id: string, payload: RespondPayload) {
    const { data } = await api.put(`/task-applications/${id}/respond`, payload);
    return data;
  },

  async addMessage(id: string, message: string) {
    const { data } = await api.post(`/task-applications/${id}/message`, { message });
    return data;
  },

  async uploadAdditionalDocuments(id: string, formData: FormData) {
    try {
      const response = await api.put(`/task-applications/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000, // 2 minutes for multiple file uploads
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading additional documents:', error);
      throw error;
    }
  },
};
