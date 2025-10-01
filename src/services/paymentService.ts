import { supabase } from '../lib/supabase';

export interface PaymentTransaction {
  id?: string;
  rental_id?: string;
  user_id: string;
  payment_gateway: string;
  gateway_order_id?: string;
  gateway_payment_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  payment_method?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export const createPaymentTransaction = async (
  transaction: Omit<PaymentTransaction, 'id' | 'created_at' | 'updated_at'>
): Promise<PaymentTransaction> => {
  const { data, error } = await supabase
    .from('payment_transactions')
    .insert(transaction)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to create payment transaction');
  }

  return data;
};

export const updatePaymentTransaction = async (
  id: string,
  updates: Partial<PaymentTransaction>
): Promise<PaymentTransaction> => {
  const { data, error } = await supabase
    .from('payment_transactions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to update payment transaction');
  }

  return data;
};

export const getPaymentTransactionByOrderId = async (
  orderId: string
): Promise<PaymentTransaction | null> => {
  const { data, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('gateway_order_id', orderId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || 'Failed to fetch payment transaction');
  }

  return data;
};

export const getUserPaymentTransactions = async (
  userId: string
): Promise<PaymentTransaction[]> => {
  const { data, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Failed to fetch payment transactions');
  }

  return data;
};
