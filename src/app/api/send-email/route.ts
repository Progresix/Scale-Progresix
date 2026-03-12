import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured, createAdminClient, STORAGE_BUCKETS } from "@/lib/supabase/server";
import { sendPurchaseConfirmationEmail, isResendConfigured } from "@/lib/resend";

const sendEmailSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID required"),
  email: z.string().email("Valid email required").optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validationResult = sendEmailSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { transactionId, email } = validationResult.data;

    // Check if Resend is configured
    if (!isResendConfigured()) {
      return NextResponse.json({
        success: true,
        message: "Demo mode - email would be sent",
      });
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        message: "Demo mode - no database connection",
      });
    }

    const supabase = createAdminClient();

    // Build query - filter by ID or order_id
    let query = supabase
      .from("transactions")
      .select(`
        id,
        midtrans_order_id,
        guest_email,
        guest_name,
        amount,
        status,
        product_id,
        products (
          id,
          name,
          file_url
        )
      `);

    // Check if transactionId looks like an order ID (INV-xxx) or UUID
    if (transactionId.startsWith("INV-")) {
      query = query.eq("midtrans_order_id", transactionId);
    } else {
      query = query.eq("id", transactionId);
    }

    // If email is provided, also filter by email for security
    if (email) {
      query = query.eq("guest_email", email);
    }

    const { data: transaction, error: findError } = await query.single();

    if (findError || !transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Verify email matches if provided
    if (email && transaction.guest_email !== email) {
      return NextResponse.json(
        { error: "Email does not match transaction" },
        { status: 403 }
      );
    }

    // Check if transaction is successful
    if (transaction.status !== "success") {
      return NextResponse.json(
        { error: "Transaction is not completed yet" },
        { status: 400 }
      );
    }

    const product = transaction.products as { id: string; name: string; file_url: string | null };

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Generate signed URL for download (7 days expiry)
    let downloadUrl: string | null = null;
    if (product.file_url) {
      const { data: urlData, error: urlError } = await supabase.storage
        .from(STORAGE_BUCKETS.PRODUCT_FILES)
        .createSignedUrl(product.file_url, 7 * 24 * 60 * 60); // 7 days

      if (!urlError && urlData) {
        downloadUrl = urlData.signedUrl;
      }
    }

    // Send email
    const emailResult = await sendPurchaseConfirmationEmail({
      to: transaction.guest_email,
      customerName: transaction.guest_name,
      productName: product.name,
      orderId: transaction.midtrans_order_id || transaction.id,
      amount: transaction.amount,
      downloadUrl: downloadUrl || undefined,
    });

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    console.log("Email sent to:", transaction.guest_email);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      sentTo: transaction.guest_email,
    });
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
