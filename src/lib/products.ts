import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Product, ProductInsert, ProductUpdate } from "@/types/database";

// Mock products for development/demo when Supabase is not configured
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Website Template Pro",
    slug: "website-template-pro",
    description: "Template website modern dengan desain profesional untuk bisnis Anda. Include 50+ halaman, responsif, dan mudah dikustomisasi.",
    price: 299000,
    image_url: null,
    file_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "E-Book Marketing Digital",
    slug: "ebook-marketing-digital",
    description: "Panduan lengkap marketing digital untuk pemula dan profesional. Pelajari strategi SEO, SEM, dan media sosial.",
    price: 99000,
    image_url: null,
    file_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "UI Kit Premium",
    slug: "ui-kit-premium",
    description: "Koleksi komponen UI siap pakai untuk project Anda. 200+ komponen untuk Figma dan Sketch.",
    price: 199000,
    image_url: null,
    file_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Icon Pack Essential",
    slug: "icon-pack-essential",
    description: "Paket ikon SVG dengan 1000+ ikon untuk berbagai kebutuhan desain.",
    price: 149000,
    image_url: null,
    file_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Get all active products
 */
export async function getProducts(limit = 20, offset = 0): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return mockProducts.slice(offset, offset + limit);
  }
  
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return mockProducts.find(p => p.slug === slug) || null;
  }
  
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  
  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }
  
  return data;
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return mockProducts.find(p => p.id === id) || null;
  }
  
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }
  
  return data;
}

/**
 * Get related products (exclude current product)
 */
export async function getRelatedProducts(
  currentProductId: string,
  limit = 4
): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return mockProducts.filter(p => p.id !== currentProductId).slice(0, limit);
  }
  
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .neq("id", currentProductId)
    .order("created_at", { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Get all product slugs for static generation
 */
export async function getAllProductSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return mockProducts.map(p => p.slug);
  }
  
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true);
  
  if (error) {
    console.error("Error fetching product slugs:", error);
    return [];
  }
  
  return data?.map((p) => p.slug) || [];
}

/**
 * Create a new product (admin only)
 */
export async function createProduct(product: ProductInsert): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured - cannot create product");
    return null;
  }
  
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating product:", error);
    return null;
  }
  
  return data;
}

/**
 * Update a product (admin only)
 */
export async function updateProduct(
  id: string,
  updates: ProductUpdate
): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured - cannot update product");
    return null;
  }
  
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating product:", error);
    return null;
  }
  
  return data;
}

/**
 * Delete a product (admin only)
 */
export async function deleteProduct(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured - cannot delete product");
    return false;
  }
  
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting product:", error);
    return false;
  }
  
  return true;
}

/**
 * Search products by name or description
 */
export async function searchProducts(query: string, limit = 10): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return mockProducts.filter(
      p => p.name.toLowerCase().includes(query.toLowerCase()) ||
           p.description?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);
  }
  
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(limit);
  
  if (error) {
    console.error("Error searching products:", error);
    return [];
  }
  
  return data || [];
}
