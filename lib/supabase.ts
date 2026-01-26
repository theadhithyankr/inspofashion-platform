import { createClient } from '@supabase/supabase-js';
import { browserLocalStorage } from './storage';

// These will come from your Supabase project dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: browserLocalStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Database types (will expand as we build)
export type UserRole = 'customer' | 'admin' | 'manager' | 'support';

export interface Profile {
    id: string;
    email: string;
    full_name?: string;
    role: UserRole;
    created_at: string;
}

export interface Product {
    id: string;
    title: string;
    description?: string;
    slug: string;
    sku: string;
    price: number;
    compare_at_price?: number;
    images: string[];
    category: string;
    collections: string[];
    tags: string[];
    featured: boolean;
    status: 'active' | 'draft' | 'out_of_stock';
    stock_quantity: number;
    low_stock_threshold: number;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: string;
    order_number: string;
    user_id: string;
    subtotal: number;
    shipping: number;
    discount: number;
    tax: number;
    total: number;
    payment_method: 'upi' | 'card' | 'net_banking' | 'cod' | 'wallet';
    payment_status: 'pending' | 'paid' | 'failed' | 'cod_pending' | 'refunded';
    order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
    tracking_number?: string;
    courier_partner?: string;
    created_at: string;
    updated_at: string;
}
