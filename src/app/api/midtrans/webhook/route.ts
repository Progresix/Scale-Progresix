import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { isSupabaseConfigured, createAdminClient, STORAGE_BUCKETS } from "@/lib/supabase/server";
import { sendPurchaseConfirmationEmail, isResendConfigured } from "@/lib/resend";
import { logger } from "@/lib/error-logger";

/**
 * Verify Midtrans signature
 * Signature is created by hashing order_id + status_code + gross_amount + server_key with SHA512
 */
function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    logger.error(new Error("MIDTRANS_SERVER_KEY not configured"), {
      action: "verify_signature",
    });
    return false;
  }

  const signatureString = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const expectedSignature = crypto
    .createHash("sha512")
    .update(signatureString)
    .digest("hex");

  return signatureKey === expectedSignature;
}

/**
 * Map Midtrans transaction status to our status
 */
function mapTransactionStatus(
  transactionStatus: string,
  fraudStatus?: string
): "pending" | "success" | "failed" | "expired" {
  if (transactionStatus === "capture") {
    if (fraudStatus === "challenge") {
      return "pending";
    }
    return "success";
  }

  if (transactionStatus === "settlement") {
    return "success";
  }

  if (
    transactionStatus === "cancel" ||
    transactionStatus === "deny" ||
    transactionStatus === "failure"
  ) {
    return "failed";
  }

  if (transactionStatus === "expire") {
    return "expired";
  }

  return "pending";
}

/**
 * Send email with download link after successful payment
 */
async function sendSuccessEmail(
  supabase: ReturnType<typeof createAdminClient>,
  transaction: {
    id: string;
    midtrans_order_id: string | null;
    guest_email: string;
    guest_name: string;
    amount: number;
    product_id: string;
  }
) {
  try {
    // Get product details
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, name, file_url")
      .eq("id", transaction.product_id)
      .single();

    if (productError || !product) {
      logger.error(productError || new Error("Product not found"), {
        action: "fetch_product_for_email",
        productId: transaction.product_id,
      });
      return { success: false, error: "Product not found" };
    }

    // Generate signed URL for download (7 days expiry)
    let downloadUrl: string | null = null;
    if (product.file_url) {
      const { data: urlData, error: urlError } = await supabase.storage
        .from(STORAGE_BUCKETS.PRODUCT_FILES)
        .createSignedUrl(product.file_url, 7 * 24 * 60 * 60); // 7 days

      if (urlError) {
        logger.error(urlError, {
          action: "create_download_signed_url",
          productId: product.id,
        });
      } else if (urlData) {
        downloadUrl = urlData.signedUrl;
      }
    }

    // Check if Resend is configured
    if (!isResendConfigured()) {
      logger.info("Resend not configured - skipping email", {
        action: "send_success_email",
        orderId: transaction.midtrans_order_id,
      });
      return { success: true, message: "Email skipped - Resend not configured" };
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
      logger.error(new Error(emailResult.error || "Failed to send email"), {
        action: "send_success_email",
        orderId: transaction.midtrans_order_id,
      });
      return { success: false, error: emailResult.error };
    }

    logger.info("Success email sent", {
      action: "send_success_email",
      orderId: transaction.midtrans_order_id,
      email: transaction.guest_email.substring(0, 3) + "***",
    });
    return { success: true };
  } catch (error) {
    logger.error(error, {
      action: "send_success_email",
      orderId: transaction.midtrans_order_id,
    });
    return { success: false, error: "Internal error" };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse webhook body
    const body = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
      fraud_status,
    } = body;

    // Validate required fields
    if (!order_id || !status_code || !gross_amount || !signature_key || !transaction_status) {
      logger.warn("Webhook missing required fields", { action: "webhook" });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify signature
    const isValidSignature = verifySignature(
      order_id,
      status_code,
      gross_amount,
      signature_key
    );

    if (!isValidSignature) {
      logger.error(new Error("Invalid Midtrans signature"), {
        action: "webhook",
        orderId: order_id,
      });
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    logger.info("Webhook received", {
      action: "webhook",
      orderId: order_id,
      status: transaction_status,
    });

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      logger.info("Demo mode - webhook received but no database", {
        action: "webhook",
        orderId: order_id,
      });
      return NextResponse.json({
        success: true,
        message: "Demo mode - no database update",
      });
    }

    const supabase = createAdminClient();

    // Find transaction by midtrans_order_id
    const { data: transaction, error: findError } = await supabase
      .from("transactions")
      .select("*")
      .eq("midtrans_order_id", order_id)
      .single();

    if (findError || !transaction) {
      logger.error(findError || new Error("Transaction not found"), {
        action: "webhook_find_transaction",
        orderId: order_id,
      });
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Map status
    const newStatus = mapTransactionStatus(transaction_status, fraud_status);

    // Update transaction
    const updateData = {
      status: newStatus,
      payment_type: payment_type || transaction.payment_type,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from("transactions")
      .update(updateData)
      .eq("id", transaction.id);

    if (updateError) {
      logger.error(updateError, {
        action: "webhook_update_transaction",
        orderId: order_id,
      });
      return NextResponse.json(
        { error: "Failed to update transaction" },
        { status: 500 }
      );
    }

    logger.info("Transaction updated", {
      action: "webhook",
      orderId: order_id,
      newStatus,
    });

    // Send email on success
    if (newStatus === "success") {
      // Only send if previous status wasn't already success (avoid duplicate emails)
      if (transaction.status !== "success") {
        await sendSuccessEmail(supabase, transaction);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processed",
      status: newStatus,
    });
  } catch (error) {
    logger.error(error, { action: "webhook" });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
