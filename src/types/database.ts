export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      reviews: {
        Row: {
          created_at: string
          description: string
          id: string
          rating: number
          title: string
          updated_at: string
          zone_rating: number
          image_url: string | null
          likes: number
          dislikes: number
          property_type: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          rating: number
          title: string
          updated_at?: string
          zone_rating?: number
          image_url?: string | null
          likes?: number
          dislikes?: number
          property_type?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          rating?: number
          title?: string
          updated_at?: string
          zone_rating?: number
          image_url?: string | null
          likes?: number
          dislikes?: number
          property_type?: string | null
        }
        Relationships: []
      }
      review_votes: {
        Row: {
          id: string
          review_id: string
          user_id: string | null
          vote_type: string
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          user_id?: string | null
          vote_type: string
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          user_id?: string | null
          vote_type?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_votes_review_id_fkey"
            columns: ["review_id"]
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
