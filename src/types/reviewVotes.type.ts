import { Database } from './supabase';

export type ReviewVotes = Database['public']['Tables']['review_votes']['Row'];
