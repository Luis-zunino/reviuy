import { Database } from './supabase';

export type ReviewReports = Database['public']['Tables']['review_reports']['Row'];
export type ReviewReportsInsert = Database['public']['Tables']['review_reports']['Insert'];

export interface ReviewReportBaseResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Response para creación de reporte
export interface CreateReviewReportResponse extends ReviewReportBaseResponse {
  report_id?: string;
  report?: ReviewReportsInsert;
}

// Response para obtener un reporte específico
export interface GetReviewReportResponse extends ReviewReportBaseResponse {
  report?: ReviewReportsInsert & {
    review?: {
      id: string;
      title: string;
      rating: number;
      user_id: string;
    };
    reporter?: {
      id: string;
      email?: string;
      username?: string;
    };
  };
}

// Response para lista de reportes
export interface GetReviewReportsResponse extends ReviewReportBaseResponse {
  reports: (ReviewReportsInsert & {
    review?: {
      id: string;
      title: string;
      rating: number;
      user_id: string;
    };
    reporter?: {
      id: string;
      email?: string;
      username?: string;
    };
  })[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Response para verificación de reporte existente
export interface CheckUserReportResponse {
  has_reported: boolean;
  existing_report?: ReviewReportsInsert;
}

// Request para crear reporte
export interface CreateReviewReportRequest {
  review_id: string;
  reason: string;
  description?: string;
}
