import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { isSupabaseConfigured, createAdminClient, STORAGE_BUCKETS } from "@/lib/supabase/server";
import type { Product, ProductInsert } from "@/types/database";
import { v4 as uuidv4 } from "uuid";

// Mock products for demo mode
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Website Template Pro",
    slug: "website-template-pro",
    description: "Template website modern dengan desain profesional untuk bisnis Anda.",
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
    description: "Panduan lengkap marketing digital untuk pemula dan profesional.",
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
    description: "Koleksi komponen UI siap pakai untuk project Anda.",
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

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// GET - List all products with search and pagination
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    // Demo mode - return mock data
    if (!isSupabaseConfigured()) {
      let filtered = mockProducts;
      if (search) {
        filtered = mockProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.slug.toLowerCase().includes(search.toLowerCase())
        );
      }
      const total = filtered.length;
      const paginatedData = filtered.slice(offset, offset + limit);

      return NextResponse.json({
        data: paginatedData,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    }

    // Real Supabase query
    const supabase = createAdminClient();

    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }

    return NextResponse.json({
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("Error in products GET:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const slug = (formData.get("slug") as string) || generateSlug(name);
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string, 10);
    const isActive = formData.get("is_active") === "true";
    const imageFile = formData.get("image") as File | null;
    const productFile = formData.get("file") as File | null;

    // Validate required fields
    if (!name || !price || isNaN(price)) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;
    let filePath: string | null = null;

    // Demo mode
    if (!isSupabaseConfigured()) {
      const newProduct: Product = {
        id: uuidv4(),
        name,
        slug,
        description: description || null,
        price,
        image_url: imageUrl,
        file_url: filePath,
        is_active: isActive,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockProducts.push(newProduct);
      return NextResponse.json({ success: true, data: newProduct });
    }

    const supabase = createAdminClient();

    // Upload image if provided
    if (imageFile && imageFile.size > 0) {
      const imageExt = imageFile.name.split(".").pop();
      const imageName = `${uuidv4()}.${imageExt}`;
      const imagePath = `products/${imageName}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
        .upload(imagePath, imageFile, {
          contentType: imageFile.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
      }

      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
        .getPublicUrl(imagePath);
      imageUrl = urlData.publicUrl;
    }

    // Upload product file if provided
    if (productFile && productFile.size > 0) {
      const fileExt = productFile.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.PRODUCT_FILES)
        .upload(filePath, productFile, {
          contentType: productFile.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        return NextResponse.json({ error: "Failed to upload product file" }, { status: 500 });
      }
    }

    // Check if slug exists
    const { data: existingSlug } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .single();

    const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

    // Insert product
    const productData: ProductInsert = {
      name,
      slug: finalSlug,
      description: description || null,
      price,
      image_url: imageUrl,
      file_url: filePath,
      is_active: isActive,
    };

    const { data, error } = await supabase
      .from("products")
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in products POST:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
