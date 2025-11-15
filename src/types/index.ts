export interface FormData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  program: string;
  university: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  admin_response?: string;
  client_document?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  in_review: number;
  approved: number;
  rejected: number;
}
