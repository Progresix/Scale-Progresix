import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { isSupabaseConfigured, createAdminClient } from "@/lib/supabase/server";
import { createTransaction, isMidtransConfigured } from "@/lib/midtrans";
import { transactionRateLimiter, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/error-logger";
import type { Product, TransactionInsert } from "@/types/database";

// Validation schema
const checkoutSchema = z.object({
  productSlug: z.string().min(1, "Produk harus dipilih"),
  guestName: z.string().min(2, "Nama minimal 2 karakter"),
  guestEmail: z.string().email("Email tidak valid"),
});

// Mock product for demo
const mockProduct: Product = {
  id: "demo-product-1",
  name: "Demo Product",
  slug: "demo-product",
  description: "Demo product for testing",
  price: 99000,
  image_url: null,
  file_url: null,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Mock transactions store for demo
const mockTransactions: Map<string, TransactionInsert & { id: string }> = new Map();

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const clientIp = getClientIp(request);
    const rateLimitResult = transactionRateLimiter.check(clientIp);
    
    if (!rateLimitResult.allowed) {
      logger.warn("Rate limit exceeded for transaction creation", { 
        action: "create_transaction",
        ip: clientIp,
      });
      return NextResponse.json(
        { 
          error: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
          rateLimited: true,
          retryAfter: rateLimitResult.retryAfter,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = checkoutSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0]?.message || "Validasi gagal" },
        { status: 400 }
      );
    }

    const { productSlug, guestName, guestEmail } = validationResult.data;

    // Get product
    let product: Product | null = null;
    
    if (isSupabaseConfigured()) {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", productSlug)
        .eq("is_active", true)
        .single();
      
      if (error || !data) {
        logger.warn("Product not found for checkout", { productSlug });
        return NextResponse.json(
          { error: "Produk tidak ditemukan" },
          { status: 404 }
        );
      }
      product = data;
    } else {
      // Use mock product for demo
      product = { ...mockProduct, slug: productSlug };
    }

    // Generate unique order ID
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderId = `INV-${timestamp}-${random}`;

    // Create Midtrans transaction
    let snapToken: string | null = null;
    
    if (isMidtransConfigured()) {
      const midtransResult = await createTransaction({
        transaction_details: {
          order_id: orderId,
          gross_amount: product.price,
        },
        customer_details: {
          first_name: guestName,
          email: guestEmail,
        },
        item_details: [
          {
            id: product.id,
            price: product.price,
            quantity: 1,
            name: product.name,
          },
        ],
      });

      if (!midtransResult.success) {
        logger.error(new Error(midtransResult.error || "Midtrans error"), {
          action: "create_midtrans_transaction",
          orderId,
          productSlug,
        });
        return NextResponse.json(
          { error: "Gagal membuat transaksi pembayaran" },
          { status: 500 }
        );
      }

      snapToken = midtransResult.data?.token || null;
    }

    // Insert transaction into database
    const transactionData: TransactionInsert = {
      product_id: product.id,
      amount: product.price,
      status: "pending",
      midtrans_order_id: orderId,
      guest_name: guestName,
      guest_email: guestEmail,
    };

    if (isSupabaseConfigured()) {
      const supabase = createAdminClient();
      const { error } = await supabase
        .from("transactions")
        .insert(transactionData);

      if (error) {
        logger.error(error, { action: "insert_transaction", orderId });
        return NextResponse.json(
          { error: "Gagal menyimpan transaksi" },
          { status: 500 }
        );
      }
    } else {
      // Store in mock for demo
      mockTransactions.set(orderId, {
        ...transactionData,
        id: uuidv4(),
      });
    }

    logger.info("Transaction created successfully", { 
      orderId, 
      productSlug,
      email: guestEmail.substring(0, 3) + "***",
    });

    return NextResponse.json({
      success: true,
      snapToken,
      orderId,
      product: {
        name: product.name,
        price: product.price,
      },
      remaining: rateLimitResult.remaining,
    });
  } catch (error) {
    logger.error(error, { action: "create_transaction" });
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

// Export for demo mode access
export { mockTransactions };
