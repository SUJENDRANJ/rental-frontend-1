/*
  # Create rentals table

  1. New Tables
    - `rentals`
      - `id` (uuid, primary key)
      - `product_id` (uuid, references products)
      - `renter_id` (uuid, references profiles)
      - `host_id` (uuid, references profiles)
      - `start_date` (date, not null)
      - `end_date` (date, not null)
      - `total_days` (integer, not null)
      - `price_per_day` (decimal, not null)
      - `total_amount` (decimal, not null)
      - `service_fee` (decimal, default 0)
      - `insurance_fee` (decimal, default 0)
      - `security_deposit` (decimal, default 0)
      - `status` (enum: pending, confirmed, active, completed, cancelled)
      - `payment_method` (text)
      - `payment_status` (enum: pending, paid, refunded, failed)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `rentals` table
    - Add policies for renters and hosts to access their rentals
*/

-- Create enum types
CREATE TYPE rental_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');

-- Create rentals table
CREATE TABLE IF NOT EXISTS rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  renter_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  host_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_days integer NOT NULL,
  price_per_day decimal(10,2) NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  service_fee decimal(10,2) DEFAULT 0,
  insurance_fee decimal(10,2) DEFAULT 0,
  security_deposit decimal(10,2) DEFAULT 0,
  status rental_status DEFAULT 'pending',
  payment_method text,
  payment_status payment_status DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;

-- Policies for rentals
CREATE POLICY "Users can view their own rentals as renter"
  ON rentals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = renter_id);

CREATE POLICY "Users can view their own rentals as host"
  ON rentals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = host_id);

CREATE POLICY "Users can insert rentals as renter"
  ON rentals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Users can update their own rentals as renter"
  ON rentals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = renter_id);

CREATE POLICY "Users can update their own rentals as host"
  ON rentals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id);

-- Trigger for updated_at
CREATE TRIGGER update_rentals_updated_at
  BEFORE UPDATE ON rentals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS rentals_product_id_idx ON rentals(product_id);
CREATE INDEX IF NOT EXISTS rentals_renter_id_idx ON rentals(renter_id);
CREATE INDEX IF NOT EXISTS rentals_host_id_idx ON rentals(host_id);
CREATE INDEX IF NOT EXISTS rentals_status_idx ON rentals(status);
CREATE INDEX IF NOT EXISTS rentals_dates_idx ON rentals(start_date, end_date);
CREATE INDEX IF NOT EXISTS rentals_created_at_idx ON rentals(created_at DESC);