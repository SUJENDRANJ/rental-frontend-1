import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOrderData {
  orderId: string;
  amount: number;
  currency: string;
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (
  amount: number,
  currency: string = 'INR'
): Promise<RazorpayOrderData> => {
  const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
    body: {
      amount: Math.round(amount * 100),
      currency,
    },
  });

  if (error) {
    throw new Error(error.message || 'Failed to create Razorpay order');
  }

  return data;
};

export interface RazorpayPaymentOptions {
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  customerName?: string;
  customerEmail?: string;
  customerContact?: string;
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
}

export const initiateRazorpayPayment = async (
  options: RazorpayPaymentOptions
): Promise<void> => {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded) {
    throw new Error('Failed to load Razorpay SDK');
  }

  const razorpayOptions = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: options.amount,
    currency: options.currency,
    name: options.name,
    description: options.description,
    order_id: options.orderId,
    prefill: {
      name: options.customerName,
      email: options.customerEmail,
      contact: options.customerContact,
    },
    theme: {
      color: '#0F172A',
    },
    handler: function (response: any) {
      options.onSuccess(response);
    },
    modal: {
      ondismiss: function () {
        options.onFailure({ code: 'payment_cancelled', description: 'Payment cancelled by user' });
      },
    },
  };

  const razorpay = new window.Razorpay(razorpayOptions);
  razorpay.on('payment.failed', function (response: any) {
    options.onFailure(response.error);
  });

  razorpay.open();
};

export const verifyRazorpayPayment = async (
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> => {
  const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
    body: {
      orderId,
      paymentId,
      signature,
    },
  });

  if (error) {
    throw new Error(error.message || 'Failed to verify payment');
  }

  return data.verified;
};
