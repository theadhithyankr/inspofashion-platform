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
                    email: string
                    full_name: string | null
                    role: 'customer' | 'admin' | 'manager' | 'support'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    role?: 'customer' | 'admin' | 'manager' | 'support'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    role?: 'customer' | 'admin' | 'manager' | 'support'
                    created_at?: string
                    updated_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    slug: string
                    sku: string
                    price: number
                    compare_at_price: number | null
                    images: string[]
                    category: string
                    collections: string[]
                    tags: string[]
                    featured: boolean
                    status: 'active' | 'draft' | 'out_of_stock'
                    stock_quantity: number
                    low_stock_threshold: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    slug: string
                    sku: string
                    price: number
                    compare_at_price?: number | null
                    images?: string[]
                    category: string
                    collections?: string[]
                    tags?: string[]
                    featured?: boolean
                    status?: 'active' | 'draft' | 'out_of_stock'
                    stock_quantity?: number
                    low_stock_threshold?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    slug?: string
                    sku?: string
                    price?: number
                    compare_at_price?: number | null
                    images?: string[]
                    category?: string
                    collections?: string[]
                    tags?: string[]
                    featured?: boolean
                    status?: 'active' | 'draft' | 'out_of_stock'
                    stock_quantity?: number
                    low_stock_threshold?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    order_number: string
                    user_id: string
                    subtotal: number
                    shipping: number
                    discount: number
                    tax: number
                    total: number
                    payment_method: 'upi' | 'card' | 'net_banking' | 'cod' | 'wallet' | null
                    payment_status: 'pending' | 'paid' | 'failed' | 'cod_pending' | 'refunded'
                    order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned'
                    tracking_number: string | null
                    courier_partner: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    order_number: string
                    user_id: string
                    subtotal: number
                    shipping?: number
                    discount?: number
                    tax: number
                    total: number
                    payment_method?: 'upi' | 'card' | 'net_banking' | 'cod' | 'wallet' | null
                    payment_status?: 'pending' | 'paid' | 'failed' | 'cod_pending' | 'refunded'
                    order_status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned'
                    tracking_number?: string | null
                    courier_partner?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    order_number?: string
                    user_id?: string
                    subtotal?: number
                    shipping?: number
                    discount?: number
                    tax?: number
                    total?: number
                    payment_method?: 'upi' | 'card' | 'net_banking' | 'cod' | 'wallet' | null
                    payment_status?: 'pending' | 'paid' | 'failed' | 'cod_pending' | 'refunded'
                    order_status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned'
                    tracking_number?: string | null
                    courier_partner?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
