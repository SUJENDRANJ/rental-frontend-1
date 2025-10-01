/*
  # Create search and recommendation functions

  1. Search Functions
    - Full-text search for products
    - Location-based search
    - Category and filter search
    - Search suggestions

  2. Recommendation Functions
    - Recommended products based on user behavior
    - Similar products
    - Popular products in user's area
*/

-- Enable pg_trgm extension for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create full-text search function for products
CREATE OR REPLACE FUNCTION search_products(
  search_query text DEFAULT '',
  category_filter text DEFAULT NULL,
  min_price numeric DEFAULT NULL,
  max_price numeric DEFAULT NULL,
  location_city text DEFAULT NULL,
  available_only boolean DEFAULT true,
  limit_count integer DEFAULT 20,
  offset_count integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  price numeric,
  category text,
  in_stock boolean,
  rating numeric,
  review_count integer,
  images text[],
  location_city text,
  owner_name text,
  owner_avatar text,
  similarity_score real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.category,
    p.in_stock,
    p.rating,
    p.review_count,
    p.images,
    p.location_city,
    pr.name as owner_name,
    pr.avatar_url as owner_avatar,
    CASE 
      WHEN search_query = '' THEN 1.0
      ELSE GREATEST(
        similarity(p.name, search_query),
        similarity(p.description, search_query),
        similarity(array_to_string(p.tags, ' '), search_query)
      )
    END as similarity_score
  FROM products p
  JOIN profiles pr ON p.owner_id = pr.id
  WHERE 
    (search_query = '' OR (
      p.name ILIKE '%' || search_query || '%' OR
      p.description ILIKE '%' || search_query || '%' OR
      array_to_string(p.tags, ' ') ILIKE '%' || search_query || '%'
    ))
    AND (category_filter IS NULL OR p.category = category_filter)
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
    AND (location_city IS NULL OR p.location_city ILIKE '%' || location_city || '%')
    AND (NOT available_only OR p.in_stock = true)
  ORDER BY 
    similarity_score DESC,
    p.rating DESC,
    p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get search suggestions
CREATE OR REPLACE FUNCTION get_search_suggestions(
  partial_query text,
  limit_count integer DEFAULT 5
)
RETURNS TABLE (
  suggestion text,
  type text,
  count bigint
) AS $$
BEGIN
  RETURN QUERY
  -- Product names
  SELECT DISTINCT 
    p.name as suggestion,
    'product' as type,
    COUNT(*) OVER (PARTITION BY p.name) as count
  FROM products p
  WHERE p.name ILIKE '%' || partial_query || '%'
    AND p.in_stock = true
  
  UNION ALL
  
  -- Categories
  SELECT DISTINCT 
    p.category as suggestion,
    'category' as type,
    COUNT(*) OVER (PARTITION BY p.category) as count
  FROM products p
  WHERE p.category ILIKE '%' || partial_query || '%'
    AND p.in_stock = true
  
  UNION ALL
  
  -- Tags
  SELECT DISTINCT 
    unnest(p.tags) as suggestion,
    'tag' as type,
    COUNT(*) OVER (PARTITION BY unnest(p.tags)) as count
  FROM products p
  WHERE array_to_string(p.tags, ' ') ILIKE '%' || partial_query || '%'
    AND p.in_stock = true
  
  ORDER BY count DESC, suggestion ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get recommended products for a user
CREATE OR REPLACE FUNCTION get_recommended_products(
  user_id uuid,
  limit_count integer DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  price numeric,
  category text,
  rating numeric,
  images text[],
  recommendation_reason text
) AS $$
BEGIN
  RETURN QUERY
  -- Products from categories the user has rented before
  SELECT DISTINCT
    p.id,
    p.name,
    p.description,
    p.price,
    p.category,
    p.rating,
    p.images,
    'Based on your rental history' as recommendation_reason
  FROM products p
  WHERE p.category IN (
    SELECT DISTINCT pr.category
    FROM rentals r
    JOIN products pr ON r.product_id = pr.id
    WHERE r.renter_id = user_id
  )
  AND p.in_stock = true
  AND p.owner_id != user_id
  AND p.id NOT IN (
    SELECT product_id FROM rentals WHERE renter_id = user_id
  )
  ORDER BY p.rating DESC, p.review_count DESC
  LIMIT limit_count / 2
  
  UNION ALL
  
  -- Popular products in user's city
  SELECT DISTINCT
    p.id,
    p.name,
    p.description,
    p.price,
    p.category,
    p.rating,
    p.images,
    'Popular in your area' as recommendation_reason
  FROM products p
  JOIN profiles pr ON p.owner_id = pr.id
  WHERE p.location_city = (
    SELECT city FROM profiles WHERE id = user_id
  )
  AND p.in_stock = true
  AND p.owner_id != user_id
  AND p.rating >= 4.0
  ORDER BY p.rating DESC, p.review_count DESC
  LIMIT limit_count / 2;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get similar products
CREATE OR REPLACE FUNCTION get_similar_products(
  product_uuid uuid,
  limit_count integer DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  price numeric,
  category text,
  rating numeric,
  images text[]
) AS $$
DECLARE
  source_product RECORD;
BEGIN
  -- Get the source product details
  SELECT * INTO source_product FROM products WHERE id = product_uuid;
  
  IF source_product IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.category,
    p.rating,
    p.images
  FROM products p
  WHERE p.id != product_uuid
    AND p.in_stock = true
    AND (
      p.category = source_product.category OR
      p.tags && source_product.tags OR
      ABS(p.price - source_product.price) <= source_product.price * 0.5
    )
  ORDER BY 
    CASE WHEN p.category = source_product.category THEN 1 ELSE 2 END,
    p.rating DESC,
    ABS(p.price - source_product.price) ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get products by location radius
CREATE OR REPLACE FUNCTION get_products_by_location(
  center_lat numeric,
  center_lng numeric,
  radius_km numeric DEFAULT 50,
  limit_count integer DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  price numeric,
  category text,
  rating numeric,
  images text[],
  distance_km numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.category,
    p.rating,
    p.images,
    (
      6371 * acos(
        cos(radians(center_lat)) * 
        cos(radians(p.location_lat)) * 
        cos(radians(p.location_lng) - radians(center_lng)) + 
        sin(radians(center_lat)) * 
        sin(radians(p.location_lat))
      )
    ) as distance_km
  FROM products p
  WHERE p.location_lat IS NOT NULL 
    AND p.location_lng IS NOT NULL
    AND p.in_stock = true
    AND (
      6371 * acos(
        cos(radians(center_lat)) * 
        cos(radians(p.location_lat)) * 
        cos(radians(p.location_lng) - radians(center_lng)) + 
        sin(radians(center_lat)) * 
        sin(radians(p.location_lat))
      )
    ) <= radius_km
  ORDER BY distance_km ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS products_name_trgm_idx ON products USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_description_trgm_idx ON products USING gin (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_tags_gin_idx ON products USING gin (tags);
CREATE INDEX IF NOT EXISTS products_price_idx ON products (price);
CREATE INDEX IF NOT EXISTS products_rating_idx ON products (rating DESC);