-- =====================================================
-- Migration: Create products and transactions tables
-- Description: Sets up the core database schema for Scale Progresix
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: products
-- Description: Stores digital product information
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0),
    image_url TEXT,
    file_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Create index on is_active for filtering active products
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- =====================================================
-- TABLE: transactions
-- Description: Stores transaction records for guest checkout
-- =====================================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    amount INTEGER NOT NULL CHECK (amount >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'expired')),
    midtrans_order_id TEXT UNIQUE,
    payment_type TEXT,
    guest_email TEXT NOT NULL,
    guest_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create index on midtrans_order_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_transactions_midtrans_order_id ON transactions(midtrans_order_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Create index on guest_email for lookup
CREATE INDEX IF NOT EXISTS idx_transactions_guest_email ON transactions(guest_email);

-- Create index on product_id for joins
CREATE INDEX IF NOT EXISTS idx_transactions_product_id ON transactions(product_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- =====================================================
-- FUNCTION: update_updated_at_column
-- Description: Auto-update updated_at timestamp on row modification
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS: Document tables and columns
-- =====================================================
COMMENT ON TABLE products IS 'Digital products available for purchase';
COMMENT ON TABLE transactions IS 'Transaction records for guest checkouts';

COMMENT ON COLUMN products.id IS 'Unique identifier for the product';
COMMENT ON COLUMN products.name IS 'Product name';
COMMENT ON COLUMN products.slug IS 'URL-friendly product identifier';
COMMENT ON COLUMN products.description IS 'Product description';
COMMENT ON COLUMN products.price IS 'Product price in Indonesian Rupiah';
COMMENT ON COLUMN products.image_url IS 'Path to product image in Supabase Storage';
COMMENT ON COLUMN products.file_url IS 'Path to product file in Supabase Storage (private bucket)';
COMMENT ON COLUMN products.is_active IS 'Whether the product is available for purchase';

COMMENT ON COLUMN transactions.id IS 'Unique identifier for the transaction';
COMMENT ON COLUMN transactions.product_id IS 'Reference to the purchased product';
COMMENT ON COLUMN transactions.amount IS 'Transaction amount in Indonesian Rupiah';
COMMENT ON COLUMN transactions.status IS 'Current status: pending, success, failed, or expired';
COMMENT ON COLUMN transactions.midtrans_order_id IS 'Unique order ID from Midtrans payment gateway';
COMMENT ON COLUMN transactions.payment_type IS 'Payment method used (e.g., bank_transfer, gopay)';
COMMENT ON COLUMN transactions.guest_email IS 'Email address of the guest buyer';
COMMENT ON COLUMN transactions.guest_name IS 'Name of the guest buyer';
