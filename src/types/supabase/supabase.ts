export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  public: {
    Tables: {
      rate_limits: {
        Row: {
          created_at: string | null;
          endpoint: string;
          id: string;
          ip_address: unknown;
          request_count: number;
          user_id: string;
          window_start: string;
        };
        Insert: {
          created_at?: string | null;
          endpoint: string;
          id?: string;
          ip_address?: unknown;
          request_count?: number;
          user_id: string;
          window_start?: string;
        };
        Update: {
          created_at?: string | null;
          endpoint?: string;
          id?: string;
          ip_address?: unknown;
          request_count?: number;
          user_id?: string;
          window_start?: string;
        };
        Relationships: [];
      };
      real_estate_favorites: {
        Row: {
          created_at: string | null;
          id: string;
          real_estate_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          real_estate_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          real_estate_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'real_estate_favorites_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estate_vote_stats';
            referencedColumns: ['real_estate_id'];
          },
          {
            foreignKeyName: 'real_estate_favorites_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'real_estate_favorites_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estates_with_votes';
            referencedColumns: ['id'];
          },
        ];
      };
      real_estate_reports: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          real_estate_id: string;
          reason: string;
          reported_by_user_id: string | null;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          real_estate_id: string;
          reason: string;
          reported_by_user_id?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          real_estate_id?: string;
          reason?: string;
          reported_by_user_id?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'real_estate_reports_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estate_vote_stats';
            referencedColumns: ['real_estate_id'];
          },
          {
            foreignKeyName: 'real_estate_reports_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'real_estate_reports_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estates_with_votes';
            referencedColumns: ['id'];
          },
        ];
      };
      real_estate_review_reports: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          real_estate_review_id: string;
          reason: string;
          reported_by_user_id: string | null;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          real_estate_review_id: string;
          reason: string;
          reported_by_user_id?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          real_estate_review_id?: string;
          reason?: string;
          reported_by_user_id?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'real_estate_review_reports_real_estate_review_id_fkey';
            columns: ['real_estate_review_id'];
            isOneToOne: false;
            referencedRelation: 'real_estate_review_vote_stats';
            referencedColumns: ['real_estate_review_id'];
          },
          {
            foreignKeyName: 'real_estate_review_reports_real_estate_review_id_fkey';
            columns: ['real_estate_review_id'];
            isOneToOne: false;
            referencedRelation: 'real_estate_reviews';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'real_estate_review_reports_real_estate_review_id_fkey';
            columns: ['real_estate_review_id'];
            isOneToOne: false;
            referencedRelation: 'real_estate_reviews_with_votes';
            referencedColumns: ['id'];
          },
        ];
      };
      real_estate_review_votes: {
        Row: {
          created_at: string;
          id: string;
          real_estate_review_id: string;
          updated_at: string;
          user_id: string;
          user_id_snapshot: string;
          vote_type: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          real_estate_review_id: string;
          updated_at?: string;
          user_id: string;
          user_id_snapshot: string;
          vote_type: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          real_estate_review_id?: string;
          updated_at?: string;
          user_id?: string;
          user_id_snapshot?: string;
          vote_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'real_estate_review_votes_real_estate_review_id_fkey';
            columns: ['real_estate_review_id'];
            isOneToOne: false;
            referencedRelation: 'real_estate_review_vote_stats';
            referencedColumns: ['real_estate_review_id'];
          },
          {
            foreignKeyName: 'real_estate_review_votes_real_estate_review_id_fkey';
            columns: ['real_estate_review_id'];
            isOneToOne: false;
            referencedRelation: 'real_estate_reviews';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'real_estate_review_votes_real_estate_review_id_fkey';
            columns: ['real_estate_review_id'];
            isOneToOne: false;
            referencedRelation: 'real_estate_reviews_with_votes';
            referencedColumns: ['id'];
          },
        ];
      };
      real_estate_reviews: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          description: string;
          id: string;
          rating: number;
          real_estate_id: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          description: string;
          id?: string;
          rating: number;
          real_estate_id: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          description?: string;
          id?: string;
          rating?: number;
          real_estate_id?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'real_estate_reviews_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estate_vote_stats';
            referencedColumns: ['real_estate_id'];
          },
          {
            foreignKeyName: 'real_estate_reviews_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'real_estate_reviews_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estates_with_votes';
            referencedColumns: ['id'];
          },
        ];
      };
      real_estate_votes: {
        Row: {
          created_at: string | null;
          id: string;
          real_estate_id: string;
          updated_at: string | null;
          user_id: string;
          vote_type: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          real_estate_id: string;
          updated_at?: string | null;
          user_id: string;
          vote_type: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          real_estate_id?: string;
          updated_at?: string | null;
          user_id?: string;
          vote_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'real_estate_votes_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estate_vote_stats';
            referencedColumns: ['real_estate_id'];
          },
          {
            foreignKeyName: 'real_estate_votes_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'real_estate_votes_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estates_with_votes';
            referencedColumns: ['id'];
          },
        ];
      };
      real_estates: {
        Row: {
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          description: string | null;
          id: string;
          name: string;
          rating: number;
          review_count: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          rating?: number;
          review_count?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          rating?: number;
          review_count?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      review_audit: {
        Row: {
          change_type: string;
          changed_by: string | null;
          created_at: string;
          id: string;
          new_data: Json | null;
          old_data: Json | null;
          review_id: string;
        };
        Insert: {
          change_type: string;
          changed_by?: string | null;
          created_at?: string;
          id?: string;
          new_data?: Json | null;
          old_data?: Json | null;
          review_id: string;
        };
        Update: {
          change_type?: string;
          changed_by?: string | null;
          created_at?: string;
          id?: string;
          new_data?: Json | null;
          old_data?: Json | null;
          review_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'review_audit_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'review_vote_stats';
            referencedColumns: ['review_id'];
          },
          {
            foreignKeyName: 'review_audit_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'review_audit_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews_with_votes';
            referencedColumns: ['id'];
          },
        ];
      };
      review_deletions: {
        Row: {
          deleted_at: string;
          deleted_by: string | null;
          deletion_reason: string | null;
          id: string;
          review_created_at: string | null;
          review_id: string;
          review_rating: number | null;
          review_title: string | null;
        };
        Insert: {
          deleted_at?: string;
          deleted_by?: string | null;
          deletion_reason?: string | null;
          id?: string;
          review_created_at?: string | null;
          review_id: string;
          review_rating?: number | null;
          review_title?: string | null;
        };
        Update: {
          deleted_at?: string;
          deleted_by?: string | null;
          deletion_reason?: string | null;
          id?: string;
          review_created_at?: string | null;
          review_id?: string;
          review_rating?: number | null;
          review_title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'review_deletions_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'review_vote_stats';
            referencedColumns: ['review_id'];
          },
          {
            foreignKeyName: 'review_deletions_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'review_deletions_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews_with_votes';
            referencedColumns: ['id'];
          },
        ];
      };
      review_favorites: {
        Row: {
          created_at: string | null;
          id: string;
          review_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          review_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          review_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'review_favorites_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'review_vote_stats';
            referencedColumns: ['review_id'];
          },
          {
            foreignKeyName: 'review_favorites_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'review_favorites_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews_with_votes';
            referencedColumns: ['id'];
          },
        ];
      };
      review_reports: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          reason: string;
          reported_by_user_id: string | null;
          review_id: string;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          reason: string;
          reported_by_user_id?: string | null;
          review_id: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          reason?: string;
          reported_by_user_id?: string | null;
          review_id?: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'review_reports_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'review_vote_stats';
            referencedColumns: ['review_id'];
          },
          {
            foreignKeyName: 'review_reports_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'review_reports_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews_with_votes';
            referencedColumns: ['id'];
          },
        ];
      };
      review_rooms: {
        Row: {
          area_m2: number | null;
          created_at: string;
          id: string;
          review_id: string;
          room_type: string | null;
          updated_at: string;
        };
        Insert: {
          area_m2?: number | null;
          created_at?: string;
          id?: string;
          review_id: string;
          room_type?: string | null;
          updated_at?: string;
        };
        Update: {
          area_m2?: number | null;
          created_at?: string;
          id?: string;
          review_id?: string;
          room_type?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'review_rooms_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'review_vote_stats';
            referencedColumns: ['review_id'];
          },
          {
            foreignKeyName: 'review_rooms_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'review_rooms_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews_with_votes';
            referencedColumns: ['id'];
          },
        ];
      };
      review_votes: {
        Row: {
          created_at: string;
          id: string;
          review_id: string;
          user_id: string;
          vote_type: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          review_id: string;
          user_id: string;
          vote_type: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          review_id?: string;
          user_id?: string;
          vote_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'review_votes_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'review_vote_stats';
            referencedColumns: ['review_id'];
          },
          {
            foreignKeyName: 'review_votes_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'review_votes_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews_with_votes';
            referencedColumns: ['id'];
          },
        ];
      };
      reviews: {
        Row: {
          address_osm_id: string;
          address_text: string;
          apartment_number: string | null;
          created_at: string;
          deleted_at: string | null;
          description: string;
          humidity: string | null;
          id: string;
          latitude: number;
          longitude: number;
          property_type: string | null;
          rating: number;
          real_estate_experience: string | null;
          real_estate_id: string | null;
          summer_comfort: string | null;
          title: string;
          updated_at: string;
          user_id: string;
          winter_comfort: string | null;
          zone_rating: number | null;
        };
        Insert: {
          address_osm_id: string;
          address_text: string;
          apartment_number?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          description: string;
          humidity?: string | null;
          id?: string;
          latitude: number;
          longitude: number;
          property_type?: string | null;
          rating: number;
          real_estate_experience?: string | null;
          real_estate_id?: string | null;
          summer_comfort?: string | null;
          title: string;
          updated_at?: string;
          user_id: string;
          winter_comfort?: string | null;
          zone_rating?: number | null;
        };
        Update: {
          address_osm_id?: string;
          address_text?: string;
          apartment_number?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          description?: string;
          humidity?: string | null;
          id?: string;
          latitude?: number;
          longitude?: number;
          property_type?: string | null;
          rating?: number;
          real_estate_experience?: string | null;
          real_estate_id?: string | null;
          summer_comfort?: string | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
          winter_comfort?: string | null;
          zone_rating?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'reviews_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estate_vote_stats';
            referencedColumns: ['real_estate_id'];
          },
          {
            foreignKeyName: 'reviews_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estates_with_votes';
            referencedColumns: ['id'];
          },
        ];
      };
      security_logs: {
        Row: {
          action: string | null;
          created_at: string | null;
          endpoint: string | null;
          error_message: string | null;
          id: string;
          ip_address: unknown;
          metadata: Json | null;
          status: string | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          action?: string | null;
          created_at?: string | null;
          endpoint?: string | null;
          error_message?: string | null;
          id?: string;
          ip_address?: unknown;
          metadata?: Json | null;
          status?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string | null;
          created_at?: string | null;
          endpoint?: string | null;
          error_message?: string | null;
          id?: string;
          ip_address?: unknown;
          metadata?: Json | null;
          status?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      rate_limit_stats: {
        Row: {
          avg_requests_per_window: number | null;
          endpoint: string | null;
          last_request_time: string | null;
          max_requests_per_window: number | null;
          total_requests: number | null;
          unique_users: number | null;
        };
        Relationships: [];
      };
      real_estate_review_vote_stats: {
        Row: {
          dislikes: number | null;
          likes: number | null;
          real_estate_review_id: string | null;
          total_votes: number | null;
        };
        Relationships: [];
      };
      real_estate_reviews_with_votes: {
        Row: {
          created_at: string | null;
          deleted_at: string | null;
          description: string | null;
          dislikes: number | null;
          id: string | null;
          likes: number | null;
          rating: number | null;
          real_estate_id: string | null;
          title: string | null;
          total_votes: number | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'real_estate_reviews_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estate_vote_stats';
            referencedColumns: ['real_estate_id'];
          },
          {
            foreignKeyName: 'real_estate_reviews_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'real_estate_reviews_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estates_with_votes';
            referencedColumns: ['id'];
          },
        ];
      };
      real_estate_vote_stats: {
        Row: {
          dislikes: number | null;
          likes: number | null;
          real_estate_id: string | null;
          total_votes: number | null;
        };
        Relationships: [];
      };
      real_estates_with_votes: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          deleted_at: string | null;
          description: string | null;
          dislikes: number | null;
          id: string | null;
          likes: number | null;
          name: string | null;
          rating: number | null;
          review_count: number | null;
          total_votes: number | null;
          updated_at: string | null;
        };
        Relationships: [];
      };
      review_vote_stats: {
        Row: {
          dislikes: number | null;
          likes: number | null;
          review_id: string | null;
          total_votes: number | null;
        };
        Relationships: [];
      };
      reviews_with_votes: {
        Row: {
          address_osm_id: string | null;
          address_text: string | null;
          apartment_number: string | null;
          created_at: string | null;
          deleted_at: string | null;
          description: string | null;
          dislikes: number | null;
          humidity: string | null;
          id: string | null;
          latitude: number | null;
          likes: number | null;
          longitude: number | null;
          property_type: string | null;
          rating: number | null;
          real_estate_experience: string | null;
          real_estate_id: string | null;
          summer_comfort: string | null;
          title: string | null;
          total_votes: number | null;
          updated_at: string | null;
          user_id: string | null;
          winter_comfort: string | null;
          zone_rating: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'reviews_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estate_vote_stats';
            referencedColumns: ['real_estate_id'];
          },
          {
            foreignKeyName: 'reviews_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estates_with_votes';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      check_migration_status_simple: { Args: never; Returns: undefined };
      check_rate_limit: {
        Args: {
          p_endpoint: string;
          p_max_requests?: number;
          p_window_minutes?: number;
        };
        Returns: boolean;
      };
      cleanup_rate_limits: { Args: never; Returns: undefined };
      create_real_estate: {
        Args: { p_description?: string; p_name: string };
        Returns: Json;
      };
      create_real_estate_review: {
        Args: {
          p_description: string;
          p_rating: number;
          p_real_estate_id: string;
          p_title: string;
        };
        Returns: Json;
      };
      create_review: {
        Args: {
          p_address_osm_id: string;
          p_address_text: string;
          p_description: string;
          p_humidity?: string;
          p_latitude: number;
          p_longitude: number;
          p_property_type?: string;
          p_rating: number;
          p_real_estate_id?: string;
          p_summer_comfort?: string;
          p_title: string;
          p_winter_comfort?: string;
          p_zone_rating?: number;
        };
        Returns: Database['public']['CompositeTypes']['create_review_result'];
        SetofOptions: {
          from: '*';
          to: 'create_review_result';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      delete_review_safe: {
        Args: { review_id_param: string };
        Returns: boolean;
      };
      detect_suspicious_activity: {
        Args: { p_user_id?: string };
        Returns: {
          blocked_requests: number;
          suspicious_score: number;
          total_requests: number;
          user_id: string;
        }[];
      };
      get_real_estate_review_vote_counts: {
        Args: { p_real_estate_review_id: string };
        Returns: {
          dislikes_count: number;
          likes_count: number;
        }[];
      };
      get_real_estate_vote_counts: {
        Args: { p_real_estate_id: string };
        Returns: {
          dislikes_count: number;
          likes_count: number;
        }[];
      };
      get_review_delete_info: {
        Args: { review_id_param: string };
        Returns: Database['public']['CompositeTypes']['get_review_delete_info_result'];
        SetofOptions: {
          from: '*';
          to: 'get_review_delete_info_result';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      get_review_vote_counts: {
        Args: { p_review_id: string };
        Returns: {
          dislikes_count: number;
          likes_count: number;
        }[];
      };
      has_user_reported_real_estate: {
        Args: { p_real_estate_id: string };
        Returns: boolean;
      };
      has_user_reported_real_estate_review: {
        Args: { p_review_id: string };
        Returns: boolean;
      };
      has_user_reported_review: {
        Args: { p_review_id: string };
        Returns: boolean;
      };
      is_real_estate_favorite: {
        Args: { p_real_estate_id: string };
        Returns: boolean;
      };
      is_review_favorite: { Args: { p_review_id: string }; Returns: boolean };
      log_security_event: {
        Args: {
          p_action: string;
          p_error_message?: string;
          p_metadata?: Json;
          p_status?: string;
        };
        Returns: undefined;
      };
      moderate_reports: { Args: { report_id: string }; Returns: undefined };
      report_real_estate: {
        Args: {
          p_description?: string;
          p_real_estate_id: string;
          p_reason: string;
        };
        Returns: Json;
      };
      report_real_estate_review: {
        Args: {
          p_description: string;
          p_real_estate_review_id: string;
          p_reason: string;
        };
        Returns: Database['public']['CompositeTypes']['report_result'];
        SetofOptions: {
          from: '*';
          to: 'report_result';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      report_review: {
        Args: { p_description?: string; p_reason: string; p_review_id: string };
        Returns: Json;
      };
      toggle_favorite_real_estate: {
        Args: { p_real_estate_id: string };
        Returns: Database['public']['CompositeTypes']['toggle_favorite_result'];
        SetofOptions: {
          from: '*';
          to: 'toggle_favorite_result';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      toggle_favorite_review: { Args: { p_review_id: string }; Returns: Json };
      update_review: {
        Args: {
          p_description: string;
          p_humidity?: string;
          p_property_type?: string;
          p_rating: number;
          p_review_id: string;
          p_summer_comfort?: string;
          p_title: string;
          p_winter_comfort?: string;
          p_zone_rating?: number;
        };
        Returns: Json;
      };
      vote_real_estate: {
        Args: { p_real_estate_id: string; p_vote_type: string };
        Returns: Json;
      };
      vote_real_estate_review: {
        Args: { p_real_estate_review_id: string; p_vote_type: string };
        Returns: Json;
      };
      vote_review: {
        Args: { p_review_id: string; p_vote_type: string };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      action_result: {
        success: boolean | null;
        message: string | null;
        error: string | null;
      };
      create_real_estate_result: {
        success: boolean | null;
        message: string | null;
        id: string | null;
      };
      create_real_estate_review_result: {
        success: boolean | null;
        message: string | null;
        review_id: string | null;
      };
      create_review_result: {
        success: boolean | null;
        review_id: string | null;
        message: string | null;
        error: string | null;
      };
      detect_suspicious_activity_result: {
        user_id: string | null;
        total_requests: number | null;
        blocked_requests: number | null;
        suspicious_score: number | null;
      };
      get_review_delete_info_result: {
        id: string | null;
        title: string | null;
        created_at: string | null;
        rating: number | null;
        likes: number | null;
        dislikes: number | null;
        can_delete: boolean | null;
        vote_count: number | null;
        error: string | null;
      };
      report_real_estate_result: {
        success: boolean | null;
        message: string | null;
      };
      report_real_estate_review_result: {
        success: boolean | null;
        message: string | null;
        report_id: string | null;
      };
      report_result: {
        success: boolean | null;
        report_id: string | null;
        message: string | null;
        error: string | null;
      };
      report_review_result: {
        success: boolean | null;
        message: string | null;
        report_id: string | null;
      };
      result_error: {
        success: boolean | null;
        error: string | null;
      };
      result_report: {
        success: boolean | null;
        message: string | null;
        report_id: string | null;
      };
      result_success: {
        success: boolean | null;
        message: string | null;
      };
      result_success_id: {
        success: boolean | null;
        message: string | null;
        id: string | null;
      };
      result_toggle: {
        success: boolean | null;
        message: string | null;
        is_favorite: boolean | null;
      };
      result_vote: {
        success: boolean | null;
        message: string | null;
        action: string | null;
      };
      review_delete_info: {
        id: string | null;
        title: string | null;
        created_at: string | null;
        rating: number | null;
        likes: number | null;
        dislikes: number | null;
        can_delete: boolean | null;
        vote_count: number | null;
      };
      toggle_favorite_real_estate_result: {
        success: boolean | null;
        message: string | null;
        is_favorite: boolean | null;
      };
      toggle_favorite_result: {
        success: boolean | null;
        is_favorite: boolean | null;
        message: string | null;
        error: string | null;
      };
      toggle_favorite_review_result: {
        success: boolean | null;
        message: string | null;
        is_favorite: boolean | null;
      };
      update_review_result: {
        success: boolean | null;
        message: string | null;
      };
      vote_real_estate_result: {
        success: boolean | null;
        message: string | null;
      };
      vote_real_estate_review_result: {
        success: boolean | null;
        message: string | null;
      };
      vote_review_result: {
        success: boolean | null;
        message: string | null;
        action: string | null;
      };
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
