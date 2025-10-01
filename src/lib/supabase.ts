import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'renthub-auth-token',
    flowType: 'pkce'
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar_url: string | null;
          role: 'renter' | 'host';
          phone: string | null;
          address: string | null;
          city: string | null;
          country: string;
          bio: string | null;
          business_name: string | null;
          business_type: string | null;
          tax_id: string | null;
          kyc_status: 'pending' | 'approved' | 'rejected';
          phone_verified: boolean;
          identity_verified: boolean;
          address_verified: boolean;
          bank_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          avatar_url?: string | null;
          role?: 'renter' | 'host';
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string;
          bio?: string | null;
          business_name?: string | null;
          business_type?: string | null;
          tax_id?: string | null;
          kyc_status?: 'pending' | 'approved' | 'rejected';
          phone_verified?: boolean;
          identity_verified?: boolean;
          address_verified?: boolean;
          bank_verified?: boolean;
        };
        Update: {
          name?: string;
          email?: string;
          avatar_url?: string | null;
          role?: 'renter' | 'host';
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string;
          bio?: string | null;
          business_name?: string | null;
          business_type?: string | null;
          tax_id?: string | null;
          kyc_status?: 'pending' | 'approved' | 'rejected';
          phone_verified?: boolean;
          identity_verified?: boolean;
          address_verified?: boolean;
          bank_verified?: boolean;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          price_per_week: number | null;
          price_per_month: number | null;
          original_price: number | null;
          category: string;
          in_stock: boolean;
          stock_count: number;
          min_rental_days: number;
          max_rental_days: number;
          features: string[];
          tags: string[];
          images: string[];
          location_lat: number | null;
          location_lng: number | null;
          location_address: string | null;
          location_city: string | null;
          location_country: string;
          owner_id: string;
          rating: number;
          review_count: number;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string;
          price: number;
          price_per_week?: number | null;
          price_per_month?: number | null;
          original_price?: number | null;
          category: string;
          in_stock?: boolean;
          stock_count?: number;
          min_rental_days?: number;
          max_rental_days?: number;
          features?: string[];
          tags?: string[];
          images?: string[];
          location_lat?: number | null;
          location_lng?: number | null;
          location_address?: string | null;
          location_city?: string | null;
          location_country?: string;
          owner_id: string;
        };
        Update: {
          name?: string;
          description?: string;
          price?: number;
          price_per_week?: number | null;
          price_per_month?: number | null;
          original_price?: number | null;
          category?: string;
          in_stock?: boolean;
          stock_count?: number;
          min_rental_days?: number;
          max_rental_days?: number;
          features?: string[];
          tags?: string[];
          images?: string[];
          location_lat?: number | null;
          location_lng?: number | null;
          location_address?: string | null;
          location_city?: string | null;
          location_country?: string;
        };
      };
      rentals: {
        Row: {
          id: string;
          product_id: string;
          renter_id: string;
          host_id: string;
          start_date: string;
          end_date: string;
          total_days: number;
          price_per_day: number;
          total_amount: number;
          service_fee: number;
          insurance_fee: number;
          security_deposit: number;
          status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
          payment_method: string | null;
          payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          product_id: string;
          renter_id: string;
          host_id: string;
          start_date: string;
          end_date: string;
          total_days: number;
          price_per_day: number;
          total_amount: number;
          service_fee?: number;
          insurance_fee?: number;
          security_deposit?: number;
          status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
          payment_method?: string | null;
          payment_status?: 'pending' | 'paid' | 'refunded' | 'failed';
          notes?: string | null;
        };
        Update: {
          status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
          payment_method?: string | null;
          payment_status?: 'pending' | 'paid' | 'refunded' | 'failed';
          notes?: string | null;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          product_id: string;
        };
        Update: never;
      };
      reviews: {
        Row: {
          id: string;
          rental_id: string;
          reviewer_id: string;
          reviewee_id: string;
          product_id: string;
          rating: number;
          comment: string | null;
          review_type: 'product' | 'host' | 'renter';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          rental_id: string;
          reviewer_id: string;
          reviewee_id: string;
          product_id: string;
          rating: number;
          comment?: string | null;
          review_type: 'product' | 'host' | 'renter';
        };
        Update: {
          rating?: number;
          comment?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'booking' | 'payment' | 'system' | 'host' | 'review';
          title: string;
          message: string;
          read: boolean;
          priority: 'low' | 'medium' | 'high';
          related_id: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: 'booking' | 'payment' | 'system' | 'host' | 'review';
          title: string;
          message: string;
          read?: boolean;
          priority?: 'low' | 'medium' | 'high';
          related_id?: string | null;
        };
        Update: {
          read?: boolean;
        };
      };
    };
  };
}