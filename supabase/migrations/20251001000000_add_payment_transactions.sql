/*
  # Add Payment Transactions Table

  1. New Tables
    - `payment_transactions`
      - `id` (uuid, primary key)
      - `rental_id` (uuid, foreign key to rentals)
      - `user_id` (uuid, foreign key to auth.users)
      - `payment_gateway` (text) - razorpay, paypal, etc.
      - `gateway_order_id` (text) - Order ID from payment gateway
      - `gateway_payment_id` (text) - Payment ID from payment gateway
      - `amount` (numeric) - Payment amount
      - `currency` (text) - Currency code (INR, USD, etc.)
      - `status` (text) - pending, success, failed, refunded
      - `payment_method` (text) - card, upi, netbanking, etc.
      - `metadata` (jsonb) - Additional payment details
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `payment_transactions` table
    - Add policy for authenticated users to read their own transactions
    - Add policy for authenticated users to create their own transactions

  3. Notes
    - Stores all payment transaction records
    - Links payments to rentals and users
    - Supports multiple payment gateways
    - Tracks payment status and metadata
*/

CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id uuid REFERENCES rentals(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  payment_gateway text NOT NULL,
  gateway_order_id text,
  gateway_payment_id text,
  amount numeric NOT NULL,
  currency text DEFAULT 'INR',
  status text DEFAULT 'pending',
  payment_method text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment transactions"
  ON payment_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payment transactions"
  ON payment_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment transactions"
  ON payment_transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_rental_id ON payment_transactions(rental_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_gateway_order_id ON payment_transactions(gateway_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
