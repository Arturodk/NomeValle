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
          full_name: string | null
          phone: string | null
          address: string | null
          role: 'customer' | 'admin' | null
          created_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          role?: 'customer' | 'admin' | null
          created_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          role?: 'customer' | 'admin' | null
          created_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          material: string
          price: number
          stock: number | null
          is_active: boolean | null
          /** @deprecated Use builder_type instead */
          is_nomenclature: boolean | null
          builder_type: 'none' | 'nomenclature' | 'plate' | 'family_plate'
          letter_product_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          material: string
          price: number
          stock?: number | null
          is_active?: boolean | null
          /** @deprecated Use builder_type instead */
          is_nomenclature?: boolean | null
          builder_type?: 'none' | 'nomenclature' | 'plate' | 'family_plate'
          letter_product_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          material?: string
          price?: number
          stock?: number | null
          is_active?: boolean | null
          /** @deprecated Use builder_type instead */
          is_nomenclature?: boolean | null
          builder_type?: 'none' | 'nomenclature' | 'plate' | 'family_plate'
          letter_product_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          is_primary: boolean | null
          sort_order: number | null
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          is_primary?: boolean | null
          sort_order?: number | null
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          is_primary?: boolean | null
          sort_order?: number | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado'
          total: number
          shipping_name: string
          shipping_phone: string
          shipping_address: string
          wompi_transaction_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado'
          total: number
          shipping_name: string
          shipping_phone: string
          shipping_address: string
          wompi_transaction_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado'
          total?: number
          shipping_name?: string
          shipping_phone?: string
          shipping_address?: string
          wompi_transaction_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          subtotal: number
          customization: string | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          subtotal: number
          customization?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          subtotal?: number
          customization?: string | null
        }
      }
    }
  }
}

// Tipos de conveniencia para usar en los componentes de UI
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

export type Product = Tables<'products'>
export type ProductImage = Tables<'product_images'>
export type Profile = Tables<'profiles'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>

// Tipo extendido para cuando consultamos el producto incluyendo sus imágenes (Join)
export type ProductWithImages = Product & {
  product_images?: ProductImage[]
}
