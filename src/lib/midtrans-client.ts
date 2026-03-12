/**
 * Load Midtrans Snap script dynamically
 */
export function loadMidtransSnap(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.snap) {
      resolve();
      return;
    }

    // Check if script tag already exists
    const existingScript = document.getElementById('midtrans-snap-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Midtrans Snap')));
      return;
    }

    // Create and append script
    const script = document.createElement('script');
    script.id = 'midtrans-snap-script';
    script.src = process.env.NODE_ENV === 'production'
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
    script.async = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Midtrans Snap'));
    
    document.head.appendChild(script);
  });
}

/**
 * Open Midtrans Snap popup
 */
export function openSnapPopup(
  snapToken: string,
  callbacks: {
    onSuccess?: (result: SnapResult) => void;
    onPending?: (result: SnapResult) => void;
    onError?: (result: SnapResult) => void;
    onClose?: () => void;
  }
): void {
  if (!window.snap) {
    console.error('Midtrans Snap not loaded');
    return;
  }

  window.snap.pay(snapToken, {
    onSuccess: callbacks.onSuccess,
    onPending: callbacks.onPending,
    onError: callbacks.onError,
    onClose: callbacks.onClose,
  });
}

/**
 * Snap result type
 */
export interface SnapResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status?: string;
  redirect_url?: string;
}

/**
 * Extend Window interface for Midtrans Snap
 */
declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: SnapResult) => void;
          onPending?: (result: SnapResult) => void;
          onError?: (result: SnapResult) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}
