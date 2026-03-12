# Supabase Database Migrations

This directory contains SQL migration scripts for the Scale Progresix database.

## Migration Files

### 001_create_tables.sql
Creates the core tables:
- `products` - Digital products for sale
- `transactions` - Purchase transaction records (guest checkout)

### 002_enable_rls.sql
Enables Row Level Security and creates access policies:
- Public read access for active products
- Admin full access via service role or JWT claims
- Service role only access for transactions

### 003_create_storage_buckets.sql
Creates storage buckets:
- `product-images` (public) - Product thumbnails
- `product-files` (private) - Digital product files

## How to Run Migrations

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file content
4. Execute in order (001 → 002 → 003)

### Option 2: Supabase CLI
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Option 3: psql (Direct Connection)
```bash
# Get your database connection string from Supabase dashboard
psql "your-connection-string" -f supabase/migrations/001_create_tables.sql
psql "your-connection-string" -f supabase/migrations/002_enable_rls.sql
psql "your-connection-string" -f supabase/migrations/003_create_storage_buckets.sql
```

## Environment Variables

Make sure to set these in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Schema Overview

### Products Table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Product name |
| slug | text | URL-friendly identifier |
| description | text | Product description |
| price | integer | Price in IDR |
| image_url | text | Public image path |
| file_url | text | Private file path |
| is_active | boolean | Availability status |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

### Transactions Table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| product_id | uuid | Foreign key to products |
| amount | integer | Transaction amount in IDR |
| status | text | pending/success/failed/expired |
| midtrans_order_id | text | Midtrans order reference |
| payment_type | text | Payment method |
| guest_email | text | Buyer email |
| guest_name | text | Buyer name |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

## RLS Policies Summary

### Products
- **Public SELECT**: Anyone can view active products
- **Admin ALL**: Admins can manage all products

### Transactions
- **Service Role INSERT**: Only API routes can create transactions
- **Admin SELECT**: Admins can view all transactions
- **Service Role UPDATE**: Webhooks can update transaction status

## Storage Buckets

### product-images (Public)
- Max file size: 5MB
- Allowed types: JPEG, PNG, WebP, GIF
- Public URL accessible

### product-files (Private)
- Max file size: 500MB
- Allowed types: PDF, ZIP, RAR, binary
- Requires signed URL (generated server-side after purchase verification)
