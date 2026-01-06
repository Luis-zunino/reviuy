import { User } from '@supabase/supabase-js';

export interface DeleteRealEstateReviewParams {
  reviewId?: string;
  user_id?: string;
  user?: User | null;
}

export interface DeleteRealEstateReviewResponse {
  success: boolean;
  message: string;
  error?: string;
}
