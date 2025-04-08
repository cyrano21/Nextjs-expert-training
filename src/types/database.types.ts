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
      mentor_questions: {
        Row: {
          context: string | null
          created_at: string | null
          id: string
          question: string | null
          user_id: string | null
        }
        Insert: {
          context?: string | null
          created_at?: string | null
          id?: string
          question?: string | null
          user_id?: string | null
        }
        Update: {
          context?: string | null
          created_at?: string | null
          id?: string
          question?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badges: string[]
          current_streak: number
          full_name: string | null
          id: string
          last_active_date: string | null
          points: number
          role: string
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          badges?: string[]
          current_streak?: number
          full_name?: string | null
          id: string
          last_active_date?: string | null
          points?: number
          role?: string
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          badges?: string[]
          current_streak?: number
          full_name?: string | null
          id?: string
          last_active_date?: string | null
          points?: number
          role?: string
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      progress_stats: {
        Row: {
          created_at: string | null
          exercises_completed: number | null
          id: string
          lessons_completed: number
          modules_completed: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          exercises_completed?: number | null
          id?: string
          lessons_completed?: number
          modules_completed?: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          exercises_completed?: number | null
          id?: string
          lessons_completed?: number
          modules_completed?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          id: number
          item_slug: string
          item_type: Database["public"]["Enums"]["progress_item_type"]
          progress_data: Json | null
          started_at: string | null
          status: Database["public"]["Enums"]["progress_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: number
          item_slug: string
          item_type: Database["public"]["Enums"]["progress_item_type"]
          progress_data?: Json | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["progress_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: number
          item_slug?: string
          item_type?: Database["public"]["Enums"]["progress_item_type"]
          progress_data?: Json | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["progress_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
      progress_item_type:
        | "lesson"
        | "module"
        | "course"
        | "project"
        | "project_step"
        | "challenge"
        | "concept"
      progress_status: "not_started" | "in_progress" | "completed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      progress_item_type: [
        "lesson",
        "module",
        "course",
        "project",
        "project_step",
        "challenge",
        "concept",
      ],
      progress_status: ["not_started", "in_progress", "completed", "failed"],
    },
  },
} as const
