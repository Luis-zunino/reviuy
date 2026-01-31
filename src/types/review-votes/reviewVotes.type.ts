import { Database } from '@/types/supabase';

export type ReviewVotes = Database['public']['Tables']['review_votes']['Row'];
