/**
 * Database types generated from Supabase schema
 * These types match the database structure defined in migrations
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          image_url: string | null;
          file_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          file_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          file_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          product_id: string;
          amount: number;
          status: TransactionStatus;
          midtrans_order_id: string | null;
          payment_type: string | null;
          guest_email: string;
          guest_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          amount: number;
          status?: TransactionStatus;
          midtrans_order_id?: string | null;
          payment_type?: string | null;
          guest_email: string;
          guest_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          amount?: number;
          status?: TransactionStatus;
          midtrans_order_id?: string | null;
          payment_type?: string | null;
          guest_email?: string;
          guest_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transactions_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    views: Record<string, never>;
    functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      update_updated_at_column: {
        Args: Record<string, never>;
        Returns: void;
      };
      get_product_file_url: {
        Args: {
          file_path: string;
          expires_in?: number;
        };
        Returns: string;
      };
    };
    enums: {
      transaction_status: TransactionStatus;
    };
  };
}

// Transaction status type
export type TransactionStatus = 'pending' | 'success' | 'failed' | 'expired';

// Convenience types for table rows
export type Product = Database['public']['tables']['products']['Row'];
export type ProductInsert = Database['public']['tables']['products']['Insert'];
export type ProductUpdate = Database['public']['tables']['products']['Update'];

export type Transaction = Database['public']['tables']['transactions']['Row'];
export type TransactionInsert = Database['public']['tables']['transactions']['Insert'];
export type TransactionUpdate = Database['public']['tables']['transactions']['Update'];

// Transaction with product relation (for joins)
export interface TransactionWithProduct extends Transaction {
  product: Product;
}

// Storage bucket types
export type StorageBucket = 'product-images' | 'product-files';

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
