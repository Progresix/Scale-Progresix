/**
 * Check if Midtrans is properly configured
 */
export function isMidtransConfigured(): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  
  return !!(
    serverKey && 
    clientKey && 
    !serverKey.includes('your_midtrans_server_key') &&
    !clientKey.includes('your_midtrans_client_key')
  );
}

/**
 * Get Midtrans client key for frontend
 */
export function getMidtransClientKey(): string | undefined {
  return process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
}

/**
 * Get Midtrans Snap URL based on environment
 */
export function getMidtransSnapUrl(): string {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction 
    ? 'https://app.midtrans.com/snap/snap.js' 
    : 'https://app.sandbox.midtrans.com/snap/snap.js';
}
