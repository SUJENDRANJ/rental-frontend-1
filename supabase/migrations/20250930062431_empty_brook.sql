/*
  # Create reviews table

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `rental_id` (uuid, references rentals)
      - `reviewer_id` (uuid, references profiles)
      - `reviewee_id` (uuid, references profiles)
      - `product_id` (uuid, references products)
      - `rating` (integer, 1-5)
      - `comment` (text)
      - `review_type` (enum: product, host, renter)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `reviews` table
    - Add policies for public read access
    - Add policies for users to create reviews for their rentals
*/

-- Create enum type
CREATE TYPE review_type AS ENUM ('product', 'host', 'renter');

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id uuid REFERENCES rentals(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  review_type review_type NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(rental_id, reviewer_id, review_type)
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert reviews for their rentals"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_id);

-- Trigger for updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update product rating when review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS trigger AS $$
BEGIN
  -- Update product rating and review count
  UPDATE products
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
      AND review_type = 'product'
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
      AND review_type = 'product'
    )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for product rating updates
CREATE TRIGGER update_product_rating_on_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  WHEN (NEW.review_type = 'product')
  EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER update_product_rating_on_update
  AFTER UPDATE ON reviews
  FOR EACH ROW
  WHEN (NEW.review_type = 'product')
  EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER update_product_rating_on_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  WHEN (OLD.review_type = 'product')
  EXECUTE FUNCTION update_product_rating();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS reviews_rental_id_idx ON reviews(rental_id);
CREATE INDEX IF NOT EXISTS reviews_reviewer_id_idx ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS reviews_reviewee_id_idx ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON reviews(product_id);
CREATE INDEX IF NOT EXISTS reviews_rating_idx ON reviews(rating);
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON reviews(created_at DESC);