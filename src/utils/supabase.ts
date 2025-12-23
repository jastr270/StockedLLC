import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce'
  }
});

// Database schema types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          role: string;
          team_id: string;
          is_active: boolean;
          last_login: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar_url?: string;
          role?: string;
          team_id: string;
          is_active?: boolean;
          last_login?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string;
          role?: string;
          team_id?: string;
          is_active?: boolean;
          last_login?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description?: string;
          owner_id: string;
          settings: any;
          subscription: any;
          created_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          owner_id: string;
          settings?: any;
          subscription?: any;
          created_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          settings?: any;
          subscription?: any;
          is_active?: boolean;
        };
      };
      inventory_items: {
        Row: {
          id: string;
          team_id: string;
          name: string;
          description?: string;
          category: string;
          quantity: number;
          unit: string;
          cost_per_unit: number;
          supplier?: string;
          location?: string;
          expiration_date?: string;
          minimum_stock: number;
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          name: string;
          description?: string;
          category: string;
          quantity: number;
          unit: string;
          cost_per_unit: number;
          supplier?: string;
          location?: string;
          expiration_date?: string;
          minimum_stock?: number;
          created_at?: string;
          updated_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          category?: string;
          quantity?: number;
          unit?: string;
          cost_per_unit?: number;
          supplier?: string;
          location?: string;
          expiration_date?: string;
          minimum_stock?: number;
          updated_at?: string;
        };
      };
    };
  };
}