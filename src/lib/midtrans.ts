import Midtrans from 'midtrans-client';

/**
 * Check if Midtrans is properly configured
 */
export function isMidtransConfigured(): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const clientKey = process.env.MIDTRANS_CLIENT_KEY;
  
  return !!(
    serverKey && 
    clientKey && 
    !serverKey.includes('your_midtrans_server_key') &&
    !clientKey.includes('your_midtrans_client_key')
  );
}

// Initialize Midtrans Snap client
export function createSnapClient() {
  return new Midtrans.Snap({
    isProduction: process.env.NODE_ENV === 'production',
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.MIDTRANS_CLIENT_KEY!,
  });
}

// Initialize Midtrans Core API client
export function createCoreClient() {
  return new Midtrans.CoreApi({
    isProduction: process.env.NODE_ENV === 'production',
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.MIDTRANS_CLIENT_KEY!,
  });
}

// Create transaction
export async function createTransaction(params: {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  customer_details?: {
    first_name: string;
    last_name?: string;
    email: string;
    phone?: string;
  };
  item_details?: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}) {
  const snap = createSnapClient();
  
  try {
    const transaction = await snap.createTransaction(params);
    return {
      success: true,
      data: transaction,
    };
  } catch (error) {
    console.error('Midtrans transaction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create transaction',
    };
  }
}

// Verify transaction status
export async function verifyTransaction(orderId: string) {
  const core = createCoreClient();
  
  try {
    const status = await core.transaction.status(orderId);
    return {
      success: true,
      data: status,
    };
  } catch (error) {
    console.error('Midtrans verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify transaction',
    };
  }
}
