import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { isSupabaseConfigured, createAdminClient } from "@/lib/supabase/server";
import type { Transaction, Product } from "@/types/database";

// Mock transaction for demo
const getMockTransaction = (id: string): (Transaction & { product: Product }) | null => {
  const mockTransactions: Record<string, Transaction & { product: Product }> = {
    "TRX-001": {
      id: "TRX-001",
      product_id: "1",
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
        file_url: "products/demo-file.zip",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
    "TRX-002": {
      id: "TRX-002",
      product_id: "2",
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
  };

  return mockTransactions[id] || null;
};

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
      const transaction = getMockTransaction(id);
      if (!transaction) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
      }
      return NextResponse.json({ data: transaction });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
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
          slug,
          description,
          price,
          image_url,
          file_url
        )
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const transaction = {
      ...data,
      product: data.products,
    };

    return NextResponse.json({ data: transaction });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
