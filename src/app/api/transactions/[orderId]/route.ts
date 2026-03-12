import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, createAdminClient } from "@/lib/supabase/server";

// Mock transaction for demo
const mockTransaction = {
  order_id: "INV-demo-123456",
  guest_email: "demo@example.com",
  guest_name: "Demo User",
  product_name: "Demo Product",
  amount: 99000,
  status: "success",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Demo mode
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        ...mockTransaction,
        order_id: orderId,
      });
    }

    const supabase = createAdminClient();

    // Get transaction with product info
    const { data: transaction, error } = await supabase
      .from("transactions")
      .select(`
        id,
        amount,
        status,
        midtrans_order_id,
        guest_email,
        guest_name,
        created_at,
        product:products (
          name
        )
      `)
      .eq("midtrans_order_id", orderId)
      .single();

    if (error || !transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order_id: transaction.midtrans_order_id,
      guest_email: transaction.guest_email,
      guest_name: transaction.guest_name,
      product_name: (transaction.product as { name: string })?.name || "Unknown Product",
      amount: transaction.amount,
      status: transaction.status,
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
