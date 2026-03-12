import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { isSupabaseConfigured, createAdminClient, STORAGE_BUCKETS } from "@/lib/supabase/server";
import type { ProductUpdate } from "@/types/database";
import { v4 as uuidv4 } from "uuid";

// Mock products reference (shared with parent route)
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

interface Product {
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
}

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// GET - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Demo mode
    if (!isSupabaseConfigured()) {
      const product = mockProducts.find((p) => p.id === id);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ data: product });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in product GET:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string, 10);
    const isActive = formData.get("is_active") === "true";
    const imageFile = formData.get("image") as File | null;
    const productFile = formData.get("file") as File | null;
    const removeImage = formData.get("remove_image") === "true";
    const removeFile = formData.get("remove_file") === "true";

    // Validate required fields
    if (!name || !price || isNaN(price)) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    // Demo mode
    if (!isSupabaseConfigured()) {
      const productIndex = mockProducts.findIndex((p) => p.id === id);
      if (productIndex === -1) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      mockProducts[productIndex] = {
        ...mockProducts[productIndex],
        name,
        slug: slug || generateSlug(name),
        description: description || null,
        price,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      };
      return NextResponse.json({ success: true, data: mockProducts[productIndex] });
    }

    const supabase = createAdminClient();

    // Get existing product
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let imageUrl = existingProduct.image_url;
    let filePath = existingProduct.file_url;

    // Handle image removal or upload
    if (removeImage) {
      if (existingProduct.image_url) {
        // Extract path from URL
        const oldPath = existingProduct.image_url.split("/product-images/")[1];
        if (oldPath) {
          await supabase.storage.from(STORAGE_BUCKETS.PRODUCT_IMAGES).remove([`products/${oldPath.split("/").pop()}`]);
        }
      }
      imageUrl = null;
    } else if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (existingProduct.image_url) {
        const oldPath = existingProduct.image_url.split("/product-images/")[1];
        if (oldPath) {
          await supabase.storage.from(STORAGE_BUCKETS.PRODUCT_IMAGES).remove([`products/${oldPath.split("/").pop()}`]);
        }
      }

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

    // Handle file removal or upload
    if (removeFile) {
      if (existingProduct.file_url) {
        await supabase.storage.from(STORAGE_BUCKETS.PRODUCT_FILES).remove([existingProduct.file_url]);
      }
      filePath = null;
    } else if (productFile && productFile.size > 0) {
      // Delete old file if exists
      if (existingProduct.file_url) {
        await supabase.storage.from(STORAGE_BUCKETS.PRODUCT_FILES).remove([existingProduct.file_url]);
      }

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

    // Check if slug exists (for a different product)
    if (slug && slug !== existingProduct.slug) {
      const { data: existingSlug } = await supabase
        .from("products")
        .select("id")
        .eq("slug", slug)
        .neq("id", id)
        .single();

      if (existingSlug) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update product
    const updateData: ProductUpdate = {
      name,
      slug: slug || generateSlug(name),
      description: description || null,
      price,
      image_url: imageUrl,
      file_url: filePath,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in product PUT:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Demo mode
    if (!isSupabaseConfigured()) {
      const productIndex = mockProducts.findIndex((p) => p.id === id);
      if (productIndex === -1) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      mockProducts.splice(productIndex, 1);
      return NextResponse.json({ success: true, message: "Product deleted" });
    }

    const supabase = createAdminClient();

    // Get existing product to delete files
    const { data: existingProduct } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    // Delete associated files
    if (existingProduct) {
      if (existingProduct.image_url) {
        const oldPath = existingProduct.image_url.split("/product-images/")[1];
        if (oldPath) {
          await supabase.storage.from(STORAGE_BUCKETS.PRODUCT_IMAGES).remove([`products/${oldPath.split("/").pop()}`]);
        }
      }
      if (existingProduct.file_url) {
        await supabase.storage.from(STORAGE_BUCKETS.PRODUCT_FILES).remove([existingProduct.file_url]);
      }
    }

    // Delete product
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Error in product DELETE:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
