/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, not null)
      - `price` (decimal, not null) - daily rental price
      - `price_per_week` (decimal, optional)
      - `price_per_month` (decimal, optional)
      - `original_price` (decimal, optional) - for sale badges
      - `category` (text, not null)
      - `in_stock` (boolean, default true)
      - `stock_count` (integer, default 1)
      - `min_rental_days` (integer, default 1)
      - `max_rental_days` (integer, default 30)
      - `features` (text array)
      - `tags` (text array)
      - `images` (text array) - URLs to product images
      - `location_lat` (decimal)
      - `location_lng` (decimal)
      - `location_address` (text)
      - `location_city` (text)
      - `location_country` (text, default 'USA')
      - `owner_id` (uuid, references profiles)
      - `rating` (decimal, default 0)
      - `review_count` (integer, default 0)
      - `view_count` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policies for public read access
    - Add policies for owners to manage their products
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  price_per_week decimal(10,2),
  price_per_month decimal(10,2),
  original_price decimal(10,2),
  category text NOT NULL,
  in_stock boolean DEFAULT true,
  stock_count integer DEFAULT 1,
  min_rental_days integer DEFAULT 1,
  max_rental_days integer DEFAULT 30,
  features text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  location_lat decimal(10,8),
  location_lng decimal(11,8),
  location_address text,
  location_city text,
  location_country text DEFAULT 'USA',
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating decimal(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies for products
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Trigger for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_owner_id_idx ON products(owner_id);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_in_stock_idx ON products(in_stock);
CREATE INDEX IF NOT EXISTS products_location_idx ON products(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at DESC);