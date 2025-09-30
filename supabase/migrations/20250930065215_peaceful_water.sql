/*
  # Insert sample data for RentHub platform

  1. Sample Data
    - Sample profiles (hosts and renters)
    - Sample products across different categories
    - Sample rentals with different statuses
    - Sample reviews and ratings
    - Sample favorites
    - Sample notifications

  2. Functions
    - Function to generate sample data
    - Function to calculate rental statistics
*/

-- Insert sample profiles
INSERT INTO profiles (id, name, email, role, phone, address, city, country, bio, kyc_status, phone_verified, identity_verified, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'John Smith', 'john.smith@example.com', 'host', '+1-555-0101', '123 Tech Street', 'New York', 'USA', 'Experienced host with premium electronics and gadgets. I take great care of my items and ensure they are always in perfect condition.', 'approved', true, true, '2024-01-15 10:00:00'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Sarah Johnson', 'sarah.johnson@example.com', 'host', '+1-555-0102', '456 Fitness Ave', 'Los Angeles', 'USA', 'Fitness enthusiast sharing quality workout equipment and wearables. All items are sanitized and maintained regularly.', 'approved', true, true, '2024-01-20 11:00:00'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Mike Chen', 'mike.chen@example.com', 'host', '+1-555-0103', '789 Photo Blvd', 'Chicago', 'USA', 'Professional photographer offering high-end camera equipment. Perfect for events, travel, and creative projects.', 'approved', true, true, '2024-01-10 09:00:00'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Emily Davis', 'emily.davis@example.com', 'host', '+1-555-0104', '321 Office Way', 'San Francisco', 'USA', 'Office furniture and equipment specialist. Great for remote workers and temporary office setups.', 'approved', true, true, '2024-02-01 14:00:00'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Alex Rodriguez', 'alex.rodriguez@example.com', 'host', '+1-555-0105', '654 Gaming St', 'Denver', 'USA', 'Gaming enthusiast with the latest consoles, accessories, and peripherals. Perfect for gaming parties and tournaments.', 'approved', true, true, '2024-01-25 16:00:00'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Lisa Wang', 'lisa.wang@example.com', 'renter', '+1-555-0106', '987 Lifestyle Ln', 'Miami', 'USA', 'Love trying new products before buying. Always respectful with rentals and leave detailed reviews.', 'approved', true, false, '2024-02-10 12:00:00'),
  ('550e8400-e29b-41d4-a716-446655440007', 'David Kim', 'david.kim@example.com', 'renter', '+1-555-0107', '147 Tech Plaza', 'Seattle', 'USA', 'Tech professional who enjoys testing the latest gadgets and electronics for work and personal use.', 'approved', true, false, '2024-02-15 13:00:00'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Maria Garcia', 'maria.garcia@example.com', 'renter', '+1-555-0108', '258 Coffee Row', 'Portland', 'USA', 'Coffee lover and foodie always looking for new kitchen gadgets and specialty items to try.', 'approved', true, false, '2024-02-20 15:00:00');

-- Insert sample products
INSERT INTO products (id, name, description, price, price_per_week, price_per_month, category, in_stock, stock_count, features, tags, images, location_lat, location_lng, location_address, location_city, location_country, owner_id, min_rental_days, max_rental_days, created_at) VALUES
  ('prod-001', 'Wireless Bluetooth Headphones', 'Premium quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for work, travel, and entertainment.', 29.99, 180.00, 600.00, 'Electronics', true, 3, ARRAY['Noise Cancellation', '30hr Battery', 'Quick Charge', 'Wireless'], ARRAY['wireless', 'bluetooth', 'audio', 'headphones'], ARRAY['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800'], 40.7128, -74.0060, '123 Tech Street', 'New York', 'USA', '550e8400-e29b-41d4-a716-446655440001', 1, 30, '2024-01-16 10:00:00'),
  
  ('prod-002', 'Smart Fitness Watch', 'Advanced smartwatch with heart rate monitoring, GPS, and fitness tracking. Water-resistant and perfect for all activities.', 24.99, 150.00, 500.00, 'Wearables', true, 2, ARRAY['Heart Rate Monitor', 'GPS', 'Water Resistant', 'Sleep Tracking'], ARRAY['fitness', 'smart', 'health', 'watch'], ARRAY['https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800'], 34.0522, -118.2437, '456 Fitness Ave', 'Los Angeles', 'USA', '550e8400-e29b-41d4-a716-446655440002', 3, 90, '2024-01-21 11:00:00'),
  
  ('prod-003', 'Professional Camera Lens 85mm f/1.4', '85mm f/1.4 portrait lens perfect for professional photography and stunning bokeh effects. Compatible with Canon EF mount.', 129.99, 800.00, 2500.00, 'Photography', true, 1, ARRAY['85mm f/1.4', 'Professional Grade', 'Weather Sealed', 'Image Stabilization'], ARRAY['camera', 'lens', 'professional', 'portrait'], ARRAY['https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'], 41.8781, -87.6298, '789 Photo Blvd', 'Chicago', 'USA', '550e8400-e29b-41d4-a716-446655440003', 1, 14, '2024-01-11 09:00:00'),
  
  ('prod-004', 'Ergonomic Office Chair', 'Premium ergonomic chair with lumbar support, adjustable height, and breathable mesh. Perfect for long work sessions.', 39.99, 240.00, 800.00, 'Furniture', true, 2, ARRAY['Lumbar Support', 'Adjustable Height', 'Breathable Mesh', 'Ergonomic Design'], ARRAY['office', 'chair', 'ergonomic', 'furniture'], ARRAY['https://images.pexels.com/photos/6764007/pexels-photo-6764007.jpeg?auto=compress&cs=tinysrgb&w=800'], 37.7749, -122.4194, '321 Office Way', 'San Francisco', 'USA', '550e8400-e29b-41d4-a716-446655440004', 7, 365, '2024-02-02 14:00:00'),
  
  ('prod-005', 'Mechanical Gaming Keyboard', 'RGB backlit mechanical keyboard with Cherry MX switches. Perfect for gaming and professional typing.', 14.99, 90.00, 300.00, 'Gaming', true, 4, ARRAY['Cherry MX Switches', 'RGB Backlight', 'Programmable Keys', 'Gaming Mode'], ARRAY['gaming', 'keyboard', 'rgb', 'mechanical'], ARRAY['https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=800'], 39.7392, -104.9903, '654 Gaming St', 'Denver', 'USA', '550e8400-e29b-41d4-a716-446655440005', 1, 60, '2024-01-26 16:00:00'),
  
  ('prod-006', 'Portable Bluetooth Speaker', 'Compact waterproof Bluetooth speaker with 360° sound and 20-hour battery life. Perfect for outdoor activities.', 8.99, 54.00, 180.00, 'Electronics', true, 5, ARRAY['360° Sound', 'Waterproof', '20hr Battery', 'Portable'], ARRAY['speaker', 'bluetooth', 'portable', 'waterproof'], ARRAY['https://images.pexels.com/photos/1034653/pexels-photo-1034653.jpeg?auto=compress&cs=tinysrgb&w=800'], 30.2672, -97.7431, '741 Music St', 'Austin', 'USA', '550e8400-e29b-41d4-a716-446655440001', 1, 30, '2024-01-17 10:30:00'),
  
  ('prod-007', 'Yoga Mat Pro', 'Non-slip yoga mat made from eco-friendly materials. Extra thick for comfort and perfect for all yoga practices.', 4.99, 30.00, 100.00, 'Fitness', true, 8, ARRAY['Non-Slip', 'Eco-Friendly', 'Extra Thick', 'Portable'], ARRAY['yoga', 'fitness', 'eco-friendly', 'exercise'], ARRAY['https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800'], 36.1627, -86.7816, '852 Wellness Way', 'Nashville', 'USA', '550e8400-e29b-41d4-a716-446655440002', 7, 90, '2024-01-22 11:30:00'),
  
  ('prod-008', 'Smart Home Hub', 'Central control hub for smart home devices with voice control and app integration. Compatible with major brands.', 19.99, 120.00, 400.00, 'Smart Home', true, 3, ARRAY['Voice Control', 'App Integration', 'Multi-Device', 'Easy Setup'], ARRAY['smart', 'home', 'hub', 'automation'], ARRAY['https://images.pexels.com/photos/4099468/pexels-photo-4099468.jpeg?auto=compress&cs=tinysrgb&w=800'], 32.7767, -96.7970, '963 Smart Home Blvd', 'Dallas', 'USA', '550e8400-e29b-41d4-a716-446655440004', 7, 365, '2024-02-03 14:30:00');

-- Insert sample rentals
INSERT INTO rentals (id, product_id, renter_id, host_id, start_date, end_date, total_days, price_per_day, total_amount, service_fee, insurance_fee, status, payment_status, created_at) VALUES
  ('rental-001', 'prod-001', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', '2024-03-01', '2024-03-08', 7, 29.99, 209.93, 10.50, 4.20, 'active', 'paid', '2024-02-25 10:00:00'),
  ('rental-002', 'prod-003', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', '2024-02-15', '2024-02-18', 3, 129.99, 389.97, 19.50, 7.80, 'completed', 'paid', '2024-02-10 14:00:00'),
  ('rental-003', 'prod-005', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440005', '2024-03-10', '2024-03-15', 5, 14.99, 74.95, 3.75, 1.50, 'confirmed', 'paid', '2024-03-05 16:00:00'),
  ('rental-004', 'prod-002', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', '2024-02-20', '2024-02-27', 7, 24.99, 174.93, 8.75, 3.50, 'completed', 'paid', '2024-02-18 12:00:00'),
  ('rental-005', 'prod-004', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', '2024-03-15', '2024-04-15', 31, 39.99, 1239.69, 62.00, 24.80, 'pending', 'pending', '2024-03-12 09:00:00');

-- Insert sample reviews
INSERT INTO reviews (rental_id, reviewer_id, reviewee_id, product_id, rating, comment, review_type, created_at) VALUES
  ('rental-002', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'prod-003', 5, 'Amazing lens quality! Perfect for my portrait session. Mike was very helpful and the lens was in pristine condition.', 'product', '2024-02-19 10:00:00'),
  ('rental-002', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'prod-003', 5, 'Excellent host! Very professional and responsive. The equipment was exactly as described.', 'host', '2024-02-19 10:05:00'),
  ('rental-004', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'prod-002', 4, 'Great fitness watch with accurate tracking. Battery life was as advertised. Would rent again!', 'product', '2024-02-28 15:00:00'),
  ('rental-004', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'prod-002', 5, 'Sarah was fantastic to work with. Quick responses and very accommodating with pickup times.', 'host', '2024-02-28 15:05:00');

-- Insert sample favorites
INSERT INTO favorites (user_id, product_id, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440006', 'prod-001', '2024-02-20 10:00:00'),
  ('550e8400-e29b-41d4-a716-446655440006', 'prod-005', '2024-02-22 11:00:00'),
  ('550e8400-e29b-41d4-a716-446655440007', 'prod-003', '2024-02-15 14:00:00'),
  ('550e8400-e29b-41d4-a716-446655440007', 'prod-008', '2024-02-25 16:00:00'),
  ('550e8400-e29b-41d4-a716-446655440008', 'prod-002', '2024-02-18 12:00:00'),
  ('550e8400-e29b-41d4-a716-446655440008', 'prod-007', '2024-02-28 13:00:00');

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, read, priority, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'booking', 'New Booking Request', 'Lisa Wang wants to rent your Wireless Bluetooth Headphones for 7 days starting March 1st.', false, 'high', '2024-02-25 09:00:00'),
  ('550e8400-e29b-41d4-a716-446655440001', 'payment', 'Payment Received', 'You received $209.93 for the rental of Wireless Bluetooth Headphones.', false, 'medium', '2024-02-25 10:30:00'),
  ('550e8400-e29b-41d4-a716-446655440003', 'review', 'New Review Received', 'David Kim left a 5-star review for your Professional Camera Lens rental.', true, 'low', '2024-02-19 10:10:00'),
  ('550e8400-e29b-41d4-a716-446655440006', 'booking', 'Rental Confirmed', 'Your rental of Wireless Bluetooth Headphones has been confirmed by John Smith.', true, 'medium', '2024-02-25 10:15:00'),
  ('550e8400-e29b-41d4-a716-446655440007', 'system', 'Profile Verification Complete', 'Your identity verification has been approved. You can now rent items with higher trust scores.', true, 'high', '2024-02-16 09:00:00');

-- Function to get rental statistics for a host
CREATE OR REPLACE FUNCTION get_host_rental_stats(host_user_id uuid)
RETURNS TABLE (
  total_rentals bigint,
  active_rentals bigint,
  completed_rentals bigint,
  total_earnings numeric,
  average_rating numeric,
  total_reviews bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_rentals,
    COUNT(*) FILTER (WHERE status = 'active') as active_rentals,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_rentals,
    COALESCE(SUM(total_amount) FILTER (WHERE status = 'completed'), 0) as total_earnings,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(r.id) as total_reviews
  FROM rentals rt
  LEFT JOIN reviews r ON rt.id = r.rental_id AND r.review_type = 'host'
  WHERE rt.host_id = host_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get product availability for date range
CREATE OR REPLACE FUNCTION check_product_availability(
  product_uuid uuid,
  check_start_date date,
  check_end_date date
)
RETURNS boolean AS $$
DECLARE
  conflict_count integer;
BEGIN
  SELECT COUNT(*) INTO conflict_count
  FROM rentals
  WHERE product_id = product_uuid
    AND status IN ('confirmed', 'active')
    AND (
      (start_date <= check_end_date AND end_date >= check_start_date)
    );
  
  RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get trending products (most rented in last 30 days)
CREATE OR REPLACE FUNCTION get_trending_products(limit_count integer DEFAULT 10)
RETURNS TABLE (
  product_id uuid,
  product_name text,
  rental_count bigint,
  average_rating numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as product_id,
    p.name as product_name,
    COUNT(r.id) as rental_count,
    p.rating as average_rating
  FROM products p
  LEFT JOIN rentals r ON p.id = r.product_id 
    AND r.created_at >= CURRENT_DATE - INTERVAL '30 days'
    AND r.status IN ('confirmed', 'active', 'completed')
  WHERE p.in_stock = true
  GROUP BY p.id, p.name, p.rating
  ORDER BY rental_count DESC, p.rating DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;