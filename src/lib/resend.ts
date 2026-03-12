import { Resend } from 'resend';

// Lazy-initialize Resend client to avoid errors during build when API key is missing
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && !apiKey.includes('your_resend_api_key')) {
      resendClient = new Resend(apiKey);
    }
  }
  return resendClient;
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  const resend = getResendClient();
  const defaultFrom = 'noreply@scaleprogresix.com';
  
  if (!resend) {
    console.log('Resend not configured - email would have been sent:', { to, subject });
    return {
      success: true,
      message: 'Email skipped - Resend not configured',
    };
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: from || defaultFrom,
      to,
      subject,
      html,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Resend email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

// Email templates
export function generateWelcomeEmail(name: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to Scale Progresix</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Welcome to Scale Progresix!</h1>
      <p>Hi ${name},</p>
      <p>Thank you for registering at Scale Progresix. We're excited to have you on board!</p>
      <p>Start exploring our digital products and find the perfect solutions for your needs.</p>
      <br>
      <p>Best regards,<br>The Scale Progresix Team</p>
    </body>
    </html>
  `;
}

export function generateOrderConfirmationEmail(name: string, orderId: string, productName: string, amount: number) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Order Confirmation</h1>
      <p>Hi ${name},</p>
      <p>Thank you for your purchase! Your order has been confirmed.</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Amount:</strong> Rp ${amount.toLocaleString('id-ID')}</p>
      </div>
      <p>You will receive another email once your order is ready.</p>
      <br>
      <p>Best regards,<br>The Scale Progresix Team</p>
    </body>
    </html>
  `;
}

export interface PurchaseConfirmationParams {
  to: string;
  customerName: string;
  productName: string;
  orderId: string;
  amount: number;
  downloadUrl?: string;
}

export async function sendPurchaseConfirmationEmail({
  to,
  customerName,
  productName,
  orderId,
  amount,
  downloadUrl,
}: PurchaseConfirmationParams) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Pembayaran Berhasil - Scale Progresix</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; margin-top: 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #111827; margin: 0; font-size: 24px;">✅ Pembayaran Berhasil!</h1>
        </div>

        <!-- Greeting -->
        <p style="color: #374151; font-size: 16px;">Hai ${customerName},</p>
        <p style="color: #374151; font-size: 16px;">Terima kasih telah berbelanja di Scale Progresix. Pembayaran Anda telah berhasil diproses.</p>

        <!-- Order Details -->
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <h2 style="color: #111827; margin: 0 0 16px 0; font-size: 18px;">Detail Pesanan</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #6b7280; padding: 8px 0;">Order ID</td>
              <td style="color: #111827; padding: 8px 0; text-align: right; font-family: monospace;">${orderId}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 8px 0;">Produk</td>
              <td style="color: #111827; padding: 8px 0; text-align: right;">${productName}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 8px 0; font-weight: bold;">Total</td>
              <td style="color: #111827; padding: 8px 0; text-align: right; font-weight: bold;">${formatCurrency(amount)}</td>
            </tr>
          </table>
        </div>

        ${downloadUrl ? `
        <!-- Download Section -->
        <div style="background-color: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 24px 0; text-align: center;">
          <p style="color: #065f46; margin: 0 0 16px 0; font-size: 16px;">🎁 Produk digital Anda sudah siap!</p>
          <a href="${downloadUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Download Produk</a>
          <p style="color: #6b7280; margin: 12px 0 0 0; font-size: 12px;">Link download berlaku selama 7 hari</p>
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Jika ada pertanyaan, hubungi kami di <a href="mailto:support@scaleprogresix.com" style="color: #374151;">support@scaleprogresix.com</a></p>
        </div>

        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Salam,<br><strong>Tim Scale Progresix</strong></p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Pembayaran Berhasil - ${productName}`,
    html,
  });
}

// Check if Resend is configured
export function isResendConfigured(): boolean {
  const apiKey = process.env.RESEND_API_KEY;
  return !!(apiKey && !apiKey.includes('your_resend_api_key'));
}
