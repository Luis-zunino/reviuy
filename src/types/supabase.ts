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
          endpoint: string;
          id: string;
          ip_address: unknown;
          request_count: number;
          user_id: string | null;
          window_start: string;
        };
        Insert: {
          endpoint: string;
          id?: string;
          ip_address?: unknown;
          request_count?: number;
          user_id?: string | null;
          window_start?: string;
        };
        Update: {
          endpoint?: string;
          id?: string;
          ip_address?: unknown;
          request_count?: number;
          user_id?: string | null;
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
            referencedRelation: 'real_estates';
            referencedColumns: ['id'];
          },
        ];
      };
      real_estate_reports: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          real_estate_id: string;
          reason: string;
          reported_by_user_id: string;
          status: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          real_estate_id: string;
          reason: string;
          reported_by_user_id: string;
          status?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          real_estate_id?: string;
          reason?: string;
          reported_by_user_id?: string;
          status?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'real_estate_reports_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estates';
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
          reported_by_user_id: string;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          real_estate_review_id: string;
          reason: string;
          reported_by_user_id: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          real_estate_review_id?: string;
          reason?: string;
          reported_by_user_id?: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'real_estate_review_reports_real_estate_review_id_fkey';
            columns: ['real_estate_review_id'];
            isOneToOne: false;
            referencedRelation: 'real_estate_reviews';
            referencedColumns: ['id'];
          },
        ];
      };
      real_estate_review_votes: {
        Row: {
          created_at: string;
          id: string;
          real_estate_review_id: string;
          user_id: string | null;
          vote_type: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          real_estate_review_id: string;
          user_id?: string | null;
          vote_type: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          real_estate_review_id?: string;
          user_id?: string | null;
          vote_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'real_estate_review_votes_real_estate_review_id_fkey';
            columns: ['real_estate_review_id'];
            isOneToOne: false;
            referencedRelation: 'real_estate_reviews';
            referencedColumns: ['id'];
          },
        ];
      };
      real_estate_reviews: {
        Row: {
          created_at: string;
          description: string;
          dislikes: number;
          id: string;
          likes: number;
          rating: number;
          real_estate_id: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          dislikes?: number;
          id?: string;
          likes?: number;
          rating: number;
          real_estate_id: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          dislikes?: number;
          id?: string;
          likes?: number;
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
            referencedRelation: 'real_estates';
            referencedColumns: ['id'];
          },
        ];
      };
      real_estate_votes: {
        Row: {
          created_at: string;
          id: string;
          real_estate_id: string;
          user_id: string | null;
          vote_type: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          real_estate_id: string;
          user_id?: string | null;
          vote_type: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          real_estate_id?: string;
          user_id?: string | null;
          vote_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'real_estate_votes_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estates';
            referencedColumns: ['id'];
          },
        ];
      };
      real_estates: {
        Row: {
          created_at: string;
          created_by: string | null;
          dislikes: number;
          id: string;
          likes: number;
          name: string;
          rating: number | null;
          review_count: number | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          dislikes?: number;
          id?: string;
          likes?: number;
          name: string;
          rating?: number | null;
          review_count?: number | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          dislikes?: number;
          id?: string;
          likes?: number;
          name?: string;
          rating?: number | null;
          review_count?: number | null;
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
        Relationships: [];
      };
      review_deletions: {
        Row: {
          deleted_at: string;
          deleted_by: string;
          deletion_reason: string | null;
          id: string;
          review_created_at: string | null;
          review_id: string;
          review_rating: number | null;
          review_title: string | null;
        };
        Insert: {
          deleted_at?: string;
          deleted_by: string;
          deletion_reason?: string | null;
          id?: string;
          review_created_at?: string | null;
          review_id: string;
          review_rating?: number | null;
          review_title?: string | null;
        };
        Update: {
          deleted_at?: string;
          deleted_by?: string;
          deletion_reason?: string | null;
          id?: string;
          review_created_at?: string | null;
          review_id?: string;
          review_rating?: number | null;
          review_title?: string | null;
        };
        Relationships: [];
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
            referencedRelation: 'reviews';
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
          reported_by_user_id: string;
          review_id: string;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          reason: string;
          reported_by_user_id: string;
          review_id: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          reason?: string;
          reported_by_user_id?: string;
          review_id?: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'review_reports_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews';
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
            referencedRelation: 'reviews';
            referencedColumns: ['id'];
          },
        ];
      };
      review_votes: {
        Row: {
          created_at: string;
          id: string;
          review_id: string;
          user_id: string | null;
          vote_type: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          review_id: string;
          user_id?: string | null;
          vote_type: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          review_id?: string;
          user_id?: string | null;
          vote_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'review_votes_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews';
            referencedColumns: ['id'];
          },
        ];
      };
      reviews: {
        Row: {
          address_osm_id: string | null;
          address_text: string | null;
          apartment_number: string | null;
          created_at: string;
          description: string;
          dislikes: number;
          humidity: string | null;
          humidity_level: string | null;
          id: string;
          image_url: string | null;
          latitude: number | null;
          likes: number;
          longitude: number | null;
          property_type: string | null;
          rating: number;
          real_estate_experience: string | null;
          real_estate_id: string | null;
          summer_comfort: string | null;
          summer_comfort_rating: number | null;
          title: string;
          updated_at: string;
          user_id: string;
          winter_comfort: string | null;
          winter_comfort_rating: number | null;
          zone_rating: number | null;
        };
        Insert: {
          address_osm_id?: string | null;
          address_text?: string | null;
          apartment_number?: string | null;
          created_at?: string;
          description: string;
          dislikes?: number;
          humidity?: string | null;
          humidity_level?: string | null;
          id?: string;
          image_url?: string | null;
          latitude?: number | null;
          likes?: number;
          longitude?: number | null;
          property_type?: string | null;
          rating: number;
          real_estate_experience?: string | null;
          real_estate_id?: string | null;
          summer_comfort?: string | null;
          summer_comfort_rating?: number | null;
          title: string;
          updated_at?: string;
          user_id: string;
          winter_comfort?: string | null;
          winter_comfort_rating?: number | null;
          zone_rating?: number | null;
        };
        Update: {
          address_osm_id?: string | null;
          address_text?: string | null;
          apartment_number?: string | null;
          created_at?: string;
          description?: string;
          dislikes?: number;
          humidity?: string | null;
          humidity_level?: string | null;
          id?: string;
          image_url?: string | null;
          latitude?: number | null;
          likes?: number;
          longitude?: number | null;
          property_type?: string | null;
          rating?: number;
          real_estate_experience?: string | null;
          real_estate_id?: string | null;
          summer_comfort?: string | null;
          summer_comfort_rating?: number | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
          winter_comfort?: string | null;
          winter_comfort_rating?: number | null;
          zone_rating?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'reviews_real_estate_id_fkey';
            columns: ['real_estate_id'];
            isOneToOne: false;
            referencedRelation: 'real_estates';
            referencedColumns: ['id'];
          },
        ];
      };
      security_logs: {
        Row: {
          action: string | null;
          created_at: string | null;
          id: string;
          ip_address: unknown;
          user_id: string | null;
        };
        Insert: {
          action?: string | null;
          created_at?: string | null;
          id?: string;
          ip_address?: unknown;
          user_id?: string | null;
        };
        Update: {
          action?: string | null;
          created_at?: string | null;
          id?: string;
          ip_address?: unknown;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_rate_limit: {
        Args: {
          p_endpoint: string;
          p_max_requests?: number;
          p_window_minutes?: number;
        };
        Returns: boolean;
      };
      cleanup_rate_limits: { Args: never; Returns: undefined };
      create_real_estate:
        | { Args: { p_name: string }; Returns: Json }
        | { Args: { p_description?: string; p_name: string }; Returns: Json };
      create_real_estate_review:
        | {
            Args: {
              p_description: string;
              p_rating: number;
              p_real_estate_id: string;
              p_title: string;
            };
            Returns: Json;
          }
        | {
            Args: {
              p_customer_service_rating?: number;
              p_description: string;
              p_professionalism_rating?: number;
              p_rating: number;
              p_real_estate_id: string;
              p_response_time_rating?: number;
              p_title: string;
              p_transparency_rating?: number;
            };
            Returns: Json;
          };
      create_review:
        | {
            Args: {
              p_address_osm_id?: string;
              p_address_text?: string;
              p_description: string;
              p_humidity?: string;
              p_humidity_level?: string;
              p_latitude?: number;
              p_longitude?: number;
              p_property_type?: string;
              p_rating: number;
              p_real_estate_id?: string;
              p_summer_comfort?: string;
              p_summer_comfort_rating?: number;
              p_title: string;
              p_winter_comfort?: string;
              p_winter_comfort_rating?: number;
              p_zone_rating?: number;
            };
            Returns: Json;
          }
        | {
            Args: {
              p_address_text?: string;
              p_description: string;
              p_property_type?: string;
              p_rating: number;
              p_real_estate_id?: string;
              p_title: string;
              p_zone_rating?: number;
            };
            Returns: Json;
          };
      delete_review_safe: {
        Args: { review_id_param: string };
        Returns: boolean;
      };
      get_review_delete_info: {
        Args: { review_id_param: string };
        Returns: Json;
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
      refresh_supabase_schema: { Args: never; Returns: undefined };
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
          p_description?: string;
          p_real_estate_review_id: string;
          p_reason: string;
        };
        Returns: Json;
      };
      report_review: {
        Args: { p_description?: string; p_reason: string; p_review_id: string };
        Returns: Json;
      };
      toggle_favorite_real_estate: {
        Args: { p_real_estate_id: string };
        Returns: Json;
      };
      toggle_favorite_review: { Args: { p_review_id: string }; Returns: Json };
      update_review:
        | {
            Args: {
              p_description: string;
              p_humidity?: string;
              p_humidity_level?: string;
              p_property_type?: string;
              p_rating: number;
              p_review_id: string;
              p_summer_comfort?: string;
              p_summer_comfort_rating?: number;
              p_title: string;
              p_winter_comfort?: string;
              p_winter_comfort_rating?: number;
              p_zone_rating?: number;
            };
            Returns: Json;
          }
        | {
            Args: {
              p_agency_experience?: string;
              p_description: string;
              p_humidity?: string;
              p_humidity_level?: string;
              p_image_url?: string;
              p_management_company?: string;
              p_property_type?: string;
              p_rating: number;
              p_review_id: string;
              p_summer_comfort?: string;
              p_summer_comfort_rating?: number;
              p_title: string;
              p_winter_comfort?: string;
              p_winter_comfort_rating?: number;
              p_zone_rating?: number;
            };
            Returns: Json;
          }
        | {
            Args: {
              p_description: string;
              p_humidity?: string;
              p_humidity_level?: string;
              p_image_url?: string;
              p_property_type?: string;
              p_rating: number;
              p_review_id: string;
              p_summer_comfort?: string;
              p_summer_comfort_rating?: number;
              p_title: string;
              p_winter_comfort?: string;
              p_winter_comfort_rating?: number;
              p_zone_rating?: number;
            };
            Returns: Json;
          };
      vote_real_estate: {
        Args: { p_real_estate_id: string; p_vote_type: string };
        Returns: Json;
      };
      vote_real_estate_review: {
        Args: { p_review_id: string; p_vote_type: string };
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
      [_ in never]: never;
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
