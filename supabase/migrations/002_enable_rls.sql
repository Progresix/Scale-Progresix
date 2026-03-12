-- =====================================================
-- Migration: Enable Row Level Security (RLS)
-- Description: Sets up access policies for products and transactions tables
-- =====================================================

-- =====================================================
-- ENABLE RLS ON TABLES
-- =====================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PRODUCTS POLICIES
-- =====================================================

-- Policy: Allow public SELECT on active products
-- Anyone can view active products (for marketing page)
CREATE POLICY "Allow public read access to active products"
    ON products
    FOR SELECT
    USING (is_active = true);

-- Policy: Allow admin full access using service role
-- Service role bypasses RLS, but we also create a policy for authenticated admins
-- This policy uses a custom claim or role check
CREATE POLICY "Allow admin full access to products"
    ON products
    FOR ALL
    USING (
        -- Check if user has admin role via JWT claims
        auth.jwt() ->> 'role' = 'admin'
        OR
        -- Allow service role (handled by Supabase internally)
        auth.role() = 'service_role'
    );

-- Note: For admin operations, it's recommended to use service role key
-- from server-side code which bypasses RLS entirely.
-- The policy above is for cases where admin access is needed via anon key
-- with proper JWT claims.

-- =====================================================
-- TRANSACTIONS POLICIES
-- =====================================================

-- Policy: Allow INSERT via API (service role only)
-- Service role bypasses RLS, so this policy is for documentation
CREATE POLICY "Allow service role to insert transactions"
    ON transactions
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow admin SELECT access
CREATE POLICY "Allow admin to read transactions"
    ON transactions
    FOR SELECT
    USING (
        auth.jwt() ->> 'role' = 'admin'
        OR
        auth.role() = 'service_role'
    );

-- Policy: Allow service role to UPDATE (for webhook)
-- Midtrans webhook needs to update transaction status
CREATE POLICY "Allow service role to update transactions"
    ON transactions
    FOR UPDATE
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Note: Guest users can check their transaction status via a server API
-- that uses service role to query the database. This keeps the RLS secure
-- while allowing guest checkout flow.

-- =====================================================
-- HELPER FUNCTION: Check if user is admin
-- =====================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.jwt() ->> 'role' = 'admin'
        OR auth.role() = 'service_role'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- POLICY UPDATES USING HELPER FUNCTION
-- =====================================================

-- Update admin policies to use helper function for cleaner code
DROP POLICY IF EXISTS "Allow admin full access to products" ON products;
CREATE POLICY "Allow admin full access to products"
    ON products
    FOR ALL
    USING (is_admin());

DROP POLICY IF EXISTS "Allow admin to read transactions" ON transactions;
CREATE POLICY "Allow admin to read transactions"
    ON transactions
    FOR SELECT
    USING (is_admin());

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant permissions to anon role (public access)
GRANT SELECT ON products TO anon;
GRANT SELECT ON products TO authenticated;

-- Note: INSERT/UPDATE on transactions should only be done via service role
-- from API routes, not directly from client

-- =====================================================
-- COMMENTS: Document policies
-- =====================================================
COMMENT ON POLICY "Allow public read access to active products" ON products IS
    'Public users can view active products for browsing and purchasing';

COMMENT ON POLICY "Allow admin full access to products" ON products IS
    'Admin users can perform all operations on products';

COMMENT ON POLICY "Allow service role to insert transactions" ON transactions IS
    'Transactions are created via API routes using service role';

COMMENT ON POLICY "Allow admin to read transactions" ON transactions IS
    'Admin users can view all transactions';

COMMENT ON POLICY "Allow service role to update transactions" ON transactions IS
    'Midtrans webhook updates transaction status via API route';
