import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return !!(
    url && 
    key && 
    url.startsWith('http') && 
    !url.includes('your_supabase_url')
  );
}

/**
 * Create a Supabase client for server-side operations
 * Uses the anon key with cookie-based session management
 * 
 * Use this for:
 * - Server Components
 * - Server Actions
 * - Reading user session
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase admin client with service role
 * Bypasses Row Level Security - use with caution!
 * 
 * Use this for:
 * - API routes handling transactions
 * - Admin operations
 * - Webhook handlers
 * - Creating signed URLs for private files
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Storage bucket names
 */
export const STORAGE_BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
  PRODUCT_FILES: 'product-files',
} as const;

/**
 * Create a signed URL for downloading private product files
 * Should only be called after verifying purchase
 */
export async function createSignedFileUrl(
  filePath: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string | null> {
  const adminClient = createAdminClient();
  
  const { data, error } = await adminClient.storage
    .from(STORAGE_BUCKETS.PRODUCT_FILES)
    .createSignedUrl(filePath, expiresIn);
  
  if (error) {
    console.error('Error creating signed URL:', error);
    return null;
  }
  
  return data.signedUrl;
}

/**
 * Upload file to product images bucket
 */
export async function uploadProductImage(
  fileName: string,
  file: File | Buffer,
  contentType?: string
) {
  const adminClient = createAdminClient();
  
  const { data, error } = await adminClient.storage
    .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
    .upload(fileName, file, {
      contentType: contentType || 'image/jpeg',
      upsert: true,
    });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, path: data.path };
}

/**
 * Upload file to product files bucket (private)
 */
export async function uploadProductFile(
  fileName: string,
  file: File | Buffer,
  contentType?: string
) {
  const adminClient = createAdminClient();
  
  const { data, error } = await adminClient.storage
    .from(STORAGE_BUCKETS.PRODUCT_FILES)
    .upload(fileName, file, {
      contentType: contentType || 'application/octet-stream',
      upsert: true,
    });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, path: data.path };
}

/**
 * Get public URL for product image
 */
export function getProductImageUrl(path: string): string {
  const adminClient = createAdminClient();
  return adminClient.storage.from(STORAGE_BUCKETS.PRODUCT_IMAGES).getPublicUrl(path).data.publicUrl;
}
