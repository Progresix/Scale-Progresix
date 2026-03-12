import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { isSupabaseConfigured, createAdminClient } from "@/lib/supabase/server";
import type { Transaction, Product } from "@/types/database";

// Mock transactions for demo mode
const mockTransactions: (Transaction & { product: Product })[] = [
  {
    id: "TRX-001",
    product_id: "1",
    product_name: "Website Template Pro",
    amount: 299000,
    status: "success",
    midtrans_order_id: "INV-1704067200000-A1B2C3",
    payment_type: "bank_transfer",
    guest_name: "John Doe",
    guest_email: "john@example.com",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    product: {
      id: "1",
      name: "Website Template Pro",
      slug: "website-template-pro",
      description: "Template website modern",
      price: 299000,
      image_url: null,
      file_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "TRX-002",
    product_id: "2",
    product_name: "E-Book Marketing",
    amount: 99000,
    status: "pending",
    midtrans_order_id: "INV-1704153600000-D4E5F6",
    payment_type: "gopay",
    guest_name: "Jane Smith",
    guest_email: "jane@example.com",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    product: {
      id: "2",
      name: "E-Book Marketing",
      slug: "ebook-marketing",
      description: "Panduan marketing digital",
      price: 99000,
      image_url: null,
      file_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "TRX-003",
    product_id: "3",
    product_name: "UI Kit Premium",
    amount: 199000,
    status: "success",
    midtrans_order_id: "INV-1704240000000-G7H8I9",
    payment_type: "bank_transfer",
    guest_name: "Bob Wilson",
    guest_email: "bob@example.com",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    product: {
      id: "3",
      name: "UI Kit Premium",
      slug: "ui-kit-premium",
      description: "Koleksi komponen UI",
      price: 199000,
      image_url: null,
      file_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "TRX-004",
    product_id: "4",
    product_name: "Icon Pack",
    amount: 149000,
    status: "failed",
    midtrans_order_id: "INV-1704326400000-J1K2L3",
    payment_type: "credit_card",
    guest_name: "Alice Brown",
    guest_email: "alice@example.com",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    product: {
      id: "4",
      name: "Icon Pack",
      slug: "icon-pack",
      description: "Paket ikon SVG",
      price: 149000,
      image_url: null,
      file_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "TRX-005",
    product_id: "1",
    product_name: "WordPress Theme",
    amount: 249000,
    status: "expired",
    midtrans_order_id: "INV-1704412800000-M4N5O6",
    payment_type: "bank_transfer",
    guest_name: "Charlie Davis",
    guest_email: "charlie@example.com",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    product: {
      id: "1",
      name: "WordPress Theme",
      slug: "wordpress-theme",
      description: "Theme WordPress profesional",
      price: 249000,
      image_url: null,
      file_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    // Demo mode - return mock data
    if (!isSupabaseConfigured()) {
      let filtered = [...mockTransactions];
      
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.midtrans_order_id?.toLowerCase().includes(searchLower) ||
            t.guest_email.toLowerCase().includes(searchLower) ||
            t.guest_name.toLowerCase().includes(searchLower)
        );
      }
      
      if (status) {
        filtered = filtered.filter((t) => t.status === status);
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
      .from("transactions")
      .select(`
        id,
        amount,
        status,
        midtrans_order_id,
        payment_type,
        guest_email,
        guest_name,
        created_at,
        updated_at,
        product_id,
        products (
          id,
          name,
          slug
        )
      `, { count: "exact" })
      .order("created_at", { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`
        midtrans_order_id.ilike.%${search}%,
        guest_email.ilike.%${search}%,
        guest_name.ilike.%${search}%
      `);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching transactions:", error);
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
    }

    // Transform data to include product_name
    const transformedData = data?.map((t) => ({
      ...t,
      product_name: (t.products as { name: string })?.name || "Unknown Product",
    }));

    return NextResponse.json({
      data: transformedData || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("Error in transactions GET:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
