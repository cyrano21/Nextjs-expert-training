import { CodeSuggestion } from './code';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url?: string;
          created_at?: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          progress: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          progress: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          progress?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      code_submissions: {
        Row: {
          id: string;
          user_id: string;
          code: string;
          language: string;
          exercise_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          code: string;
          language: string;
          exercise_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          code?: string;
          language?: string;
          exercise_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "code_submissions_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      code_reviews: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          feedback: string;
          score: number;
          suggestions: CodeSuggestion[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          feedback: string;
          score: number;
          suggestions: CodeSuggestion[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exercise_id?: string;
          feedback?: string;
          score?: number;
          suggestions?: CodeSuggestion[];
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "code_reviews_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
  };
};