-- =====================================================
-- Migration: Create Storage Buckets
-- Description: Sets up public and private storage for product assets
-- =====================================================

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Insert buckets into storage.buckets table
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,  -- Public bucket
    5242880,  -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-files',
    'product-files',
    false,  -- Private bucket
    524288000,  -- 500MB limit for digital products
    ARRAY[
        'application/pdf',
        'application/zip',
        'application/x-zip-compressed',
        'application/x-rar-compressed',
        'application/octet-stream'
    ]
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES: product-images (PUBLIC)
-- =====================================================

-- Policy: Allow public to view product images
CREATE POLICY "Allow public to view product images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'product-images');

-- Policy: Allow admin to upload product images
CREATE POLICY "Allow admin to upload product images"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'product-images'
        AND is_admin()
    );

-- Policy: Allow admin to update product images
CREATE POLICY "Allow admin to update product images"
    ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'product-images'
        AND is_admin()
    );

-- Policy: Allow admin to delete product images
CREATE POLICY "Allow admin to delete product images"
    ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'product-images'
        AND is_admin()
    );

-- =====================================================
-- STORAGE POLICIES: product-files (PRIVATE)
-- =====================================================

-- Policy: No public access to product files (private bucket)
-- Access is controlled via API routes that check purchase status

-- Policy: Allow admin to upload product files
CREATE POLICY "Allow admin to upload product files"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'product-files'
        AND is_admin()
    );

-- Policy: Allow admin to update product files
CREATE POLICY "Allow admin to update product files"
    ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'product-files'
        AND is_admin()
    );

-- Policy: Allow admin to delete product files
CREATE POLICY "Allow admin to delete product files"
    ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'product-files'
        AND is_admin()
    );

-- Policy: Allow service role to read product files (for download API)
CREATE POLICY "Allow service role to read product files"
    ON storage.objects
    FOR SELECT
    USING (
        bucket_id = 'product-files'
        AND auth.role() = 'service_role'
    );

-- =====================================================
-- HELPER FUNCTION: Generate signed URL for file download
-- =====================================================
CREATE OR REPLACE FUNCTION get_product_file_url(
    file_path TEXT,
    expires_in INTEGER DEFAULT 3600
)
RETURNS TEXT AS $$
DECLARE
    bucket_name TEXT := 'product-files';
    signed_url TEXT;
BEGIN
    -- This function should be called from a server-side context
    -- after verifying the user has purchased the product
    -- The actual signed URL generation happens via Supabase Storage API
    
    -- Return a placeholder (actual implementation uses Supabase client)
    RETURN format('https://your-project.supabase.co/storage/v1/object/sign/%s/%s?token=SIGNATURE', 
                  bucket_name, file_path);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS: Document storage setup
-- =====================================================
COMMENT ON SCHEMA storage IS 'Supabase Storage schema for file management';
COMMENT ON TABLE storage.buckets IS 'Storage bucket definitions';

-- Note: Run these SQL commands in Supabase SQL Editor or via migration tool
-- The storage schema and tables are created automatically by Supabase
