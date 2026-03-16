export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    role: 'customer' | 'admin' | 'staff'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    role?: 'customer' | 'admin' | 'staff'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    role?: 'customer' | 'admin' | 'staff'
                    created_at?: string
                    updated_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    sku: string
                    description: string | null
                    price: number
                    category: string | null
                    stock_quantity: number
                    images: string[] | null
                    sizes: string[] | null
                    status: 'active' | 'draft' | 'archived'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    sku: string
                    description?: string | null
                    price: number
                    category?: string | null
                    stock_quantity?: number
                    images?: string[] | null
                    sizes?: string[] | null
                    status?: 'active' | 'draft' | 'archived'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    sku?: string
                    description?: string | null
                    price?: number
                    category?: string | null
                    stock_quantity?: number
                    images?: string[] | null
                    sizes?: string[] | null
                    status?: 'active' | 'draft' | 'archived'
                    created_at?: string
                    updated_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string
                    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    total_amount: number
                    shipping_address: Json | null
                    payment_status: 'pending' | 'paid' | 'failed'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    total_amount: number
                    shipping_address?: Json | null
                    payment_status?: 'pending' | 'paid' | 'failed'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    total_amount?: number
                    shipping_address?: Json | null
                    payment_status?: 'pending' | 'paid' | 'failed'
                    created_at?: string
                    updated_at?: string
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_id: string
                    quantity: number
                    price_at_purchase: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    product_id: string
                    quantity: number
                    price_at_purchase: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    product_id?: string
                    quantity?: number
                    price_at_purchase?: number
                    created_at?: string
                }
            }
        }
    }
}
