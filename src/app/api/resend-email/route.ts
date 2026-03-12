import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured, createAdminClient, STORAGE_BUCKETS } from "@/lib/supabase/server";
import { sendPurchaseConfirmationEmail, isResendConfigured } from "@/lib/resend";
import { emailRateLimiter, rateLimitResponse } from "@/lib/rate-limit";
import { logger } from "@/lib/error-logger";

const resendSchema = z.object({
  email: z.string().email("Email tidak valid"),
  orderId: z.string().min(1, "Order ID wajib diisi"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validationResult = resendSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0]?.message || "Validasi gagal" },
        { status: 400 }
      );
    }

    const { email, orderId } = validationResult.data;

    // Check rate limit
    const rateLimitResult = emailRateLimiter.check(email);
    if (!rateLimitResult.allowed) {
      logger.warn("Rate limit exceeded for email resend", { 
        action: "resend_email",
        email: email.substring(0, 3) + "***", // Partial email for privacy
      });
      const minutesLeft = Math.ceil(rateLimitResult.resetIn / 60000);
      return NextResponse.json(
        { 
          error: `Terlalu banyak permintaan. Silakan coba lagi dalam ${minutesLeft} menit.`,
          rateLimited: true,
          resetIn: rateLimitResult.resetIn,
        },
        { status: 429 }
      );
    }

    // Demo mode
    if (!isSupabaseConfigured()) {
      logger.info("Demo mode: Email resend simulated", { orderId });
      return NextResponse.json({
        success: true,
        message: "Email berhasil dikirim (demo mode)",
        remaining: rateLimitResult.remaining,
      });
    }

    // Check if Resend is configured
    if (!isResendConfigured()) {
      return NextResponse.json({
        success: true,
        message: "Demo mode - Resend tidak dikonfigurasi",
        remaining: rateLimitResult.remaining,
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
        product_id,
        product:products (
          id,
          name,
          file_url
        )
      `)
      .eq("midtrans_order_id", orderId)
      .eq("guest_email", email)
      .single();

    if (error || !transaction) {
      logger.warn("Transaction not found for email resend", { orderId, email: email.substring(0, 3) + "***" });
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan untuk email tersebut" },
        { status: 404 }
      );
    }

    if (transaction.status !== "success") {
      return NextResponse.json(
        { error: "Transaksi belum berhasil. Silakan selesaikan pembayaran terlebih dahulu." },
        { status: 400 }
      );
    }

    const product = transaction.product as { id: string; name: string; file_url: string | null };

    // Generate download link (signed URL for private file) - 7 days expiry
    let downloadUrl: string | null = null;
    if (product.file_url) {
      const { data: urlData, error: urlError } = await supabase.storage
        .from(STORAGE_BUCKETS.PRODUCT_FILES)
        .createSignedUrl(product.file_url, 7 * 24 * 60 * 60); // 7 days

      if (urlError) {
        logger.error(urlError, { action: "create_signed_url", productId: product.id });
      } else if (urlData) {
        downloadUrl = urlData.signedUrl;
      }
    }

    // Send email
    const emailResult = await sendPurchaseConfirmationEmail({
      to: email,
      customerName: transaction.guest_name,
      productName: product.name,
      orderId: transaction.midtrans_order_id || orderId,
      amount: transaction.amount,
      downloadUrl: downloadUrl || undefined,
    });

    if (!emailResult.success) {
      logger.error(new Error(emailResult.error || "Email send failed"), { 
        action: "send_email",
        orderId,
      });
      return NextResponse.json(
        { error: "Gagal mengirim email. Silakan coba lagi nanti." },
        { status: 500 }
      );
    }

    logger.info("Email resent successfully", { orderId, email: email.substring(0, 3) + "***" });

    return NextResponse.json({
      success: true,
      message: "Email berhasil dikirim",
      remaining: rateLimitResult.remaining,
    });
  } catch (error) {
    logger.error(error, { action: "resend_email" });
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
