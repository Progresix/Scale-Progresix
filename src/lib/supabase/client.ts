import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

/**
 * Create a Supabase client for browser-side operations
 * Uses the anon key (public) - respects Row Level Security
 * 
 * Use this for:
 * - Client-side data fetching
 * - User authentication
 * - Real-time subscriptions
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Type-safe table names for queries
 */
export type TableName = keyof Database['public']['tables'];

/**
 * Helper to create typed query builder
 */
export function from<T extends TableName>(table: T) {
  return createClient().from(table);
}

/**
 * Storage bucket names
 */
export const STORAGE_BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
  PRODUCT_FILES: 'product-files',
} as const;

/**
 * Get public URL for product image
 */
export function getProductImageUrl(path: string): string {
  const client = createClient();
  return client.storage.from(STORAGE_BUCKETS.PRODUCT_IMAGES).getPublicUrl(path).data.publicUrl;
}
