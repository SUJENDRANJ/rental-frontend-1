/*
  # Create additional triggers and utility functions

  1. Triggers
    - Auto-update product ratings when reviews change
    - Send notifications on rental status changes
    - Update user statistics
    - Audit trail for important changes

  2. Utility Functions
    - Calculate rental pricing with discounts
    - Generate rental invoices
    - Handle rental conflicts
    - Cleanup old data
*/

-- Function to send notification (simplified version)
CREATE OR REPLACE FUNCTION send_notification(
  recipient_id uuid,
  notification_type notification_type,
  title text,
  message text,
  priority notification_priority DEFAULT 'medium',
  related_uuid uuid DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, priority, related_id)
  VALUES (recipient_id, notification_type, title, message, priority, related_uuid)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle rental status changes and send notifications
CREATE OR REPLACE FUNCTION handle_rental_status_change()
RETURNS trigger AS $$
DECLARE
  product_name text;
  renter_name text;
  host_name text;
BEGIN
  -- Get related information
  SELECT p.name, pr_renter.name, pr_host.name
  INTO product_name, renter_name, host_name
  FROM products p
  JOIN profiles pr_renter ON NEW.renter_id = pr_renter.id
  JOIN profiles pr_host ON NEW.host_id = pr_host.id
  WHERE p.id = NEW.product_id;
  
  -- Send notifications based on status change
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    CASE NEW.status
      WHEN 'confirmed' THEN
        -- Notify renter
        PERFORM send_notification(
          NEW.renter_id,
          'booking',
          'Rental Confirmed',
          'Your rental of ' || product_name || ' has been confirmed by ' || host_name || '.',
          'medium',
          NEW.id
        );
        
        -- Notify host
        PERFORM send_notification(
          NEW.host_id,
          'booking',
          'Rental Confirmed',
          'You confirmed the rental of ' || product_name || ' to ' || renter_name || '.',
          'low',
          NEW.id
        );
        
      WHEN 'active' THEN
        -- Notify renter
        PERFORM send_notification(
          NEW.renter_id,
          'booking',
          'Rental Started',
          'Your rental of ' || product_name || ' is now active. Enjoy!',
          'medium',
          NEW.id
        );
        
      WHEN 'completed' THEN
        -- Notify both parties
        PERFORM send_notification(
          NEW.renter_id,
          'booking',
          'Rental Completed',
          'Your rental of ' || product_name || ' has been completed. Please leave a review!',
          'low',
          NEW.id
        );
        
        PERFORM send_notification(
          NEW.host_id,
          'booking',
          'Rental Completed',
          'The rental of ' || product_name || ' to ' || renter_name || ' has been completed.',
          'low',
          NEW.id
        );
        
      WHEN 'cancelled' THEN
        -- Notify both parties
        PERFORM send_notification(
          NEW.renter_id,
          'booking',
          'Rental Cancelled',
          'Your rental of ' || product_name || ' has been cancelled.',
          'high',
          NEW.id
        );
        
        PERFORM send_notification(
          NEW.host_id,
          'booking',
          'Rental Cancelled',
          'The rental of ' || product_name || ' to ' || renter_name || ' has been cancelled.',
          'medium',
          NEW.id
        );
    END CASE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for rental status changes
DROP TRIGGER IF EXISTS rental_status_change_trigger ON rentals;
CREATE TRIGGER rental_status_change_trigger
  AFTER UPDATE ON rentals
  FOR EACH ROW
  EXECUTE FUNCTION handle_rental_status_change();

-- Function to calculate rental pricing with discounts
CREATE OR REPLACE FUNCTION calculate_rental_pricing(
  product_uuid uuid,
  rental_days integer,
  start_date date DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  daily_rate numeric,
  weekly_rate numeric,
  monthly_rate numeric,
  total_base_cost numeric,
  discount_amount numeric,
  service_fee numeric,
  insurance_fee numeric,
  total_cost numeric,
  discount_type text
) AS $$
DECLARE
  product_record RECORD;
  base_cost numeric;
  discount numeric := 0;
  discount_desc text := 'None';
BEGIN
  -- Get product details
  SELECT * INTO product_record FROM products WHERE id = product_uuid;
  
  IF product_record IS NULL THEN
    RAISE EXCEPTION 'Product not found';
  END IF;
  
  -- Calculate base cost
  base_cost := product_record.price * rental_days;
  
  -- Apply discounts based on rental duration
  IF rental_days >= 30 AND product_record.price_per_month IS NOT NULL THEN
    -- Monthly discount
    base_cost := product_record.price_per_month * (rental_days / 30.0);
    discount_desc := 'Monthly Rate Applied';
  ELSIF rental_days >= 7 AND product_record.price_per_week IS NOT NULL THEN
    -- Weekly discount
    base_cost := product_record.price_per_week * (rental_days / 7.0);
    discount_desc := 'Weekly Rate Applied';
  ELSIF rental_days >= 7 THEN
    -- Long-term discount (10% for 7+ days)
    discount := base_cost * 0.10;
    discount_desc := '10% Long-term Discount';
  ELSIF rental_days >= 3 THEN
    -- Short-term discount (5% for 3+ days)
    discount := base_cost * 0.05;
    discount_desc := '5% Multi-day Discount';
  END IF;
  
  RETURN QUERY
  SELECT 
    product_record.price as daily_rate,
    product_record.price_per_week as weekly_rate,
    product_record.price_per_month as monthly_rate,
    base_cost as total_base_cost,
    discount as discount_amount,
    (base_cost - discount) * 0.05 as service_fee,  -- 5% service fee
    (base_cost - discount) * 0.02 as insurance_fee, -- 2% insurance fee
    (base_cost - discount) * 1.07 as total_cost,   -- Total with fees
    discount_desc as discount_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check for rental conflicts
CREATE OR REPLACE FUNCTION check_rental_conflicts(
  product_uuid uuid,
  check_start_date date,
  check_end_date date,
  exclude_rental_id uuid DEFAULT NULL
)
RETURNS TABLE (
  conflict_rental_id uuid,
  conflict_start_date date,
  conflict_end_date date,
  renter_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id as conflict_rental_id,
    r.start_date as conflict_start_date,
    r.end_date as conflict_end_date,
    p.name as renter_name
  FROM rentals r
  JOIN profiles p ON r.renter_id = p.id
  WHERE r.product_id = product_uuid
    AND r.status IN ('confirmed', 'active')
    AND (exclude_rental_id IS NULL OR r.id != exclude_rental_id)
    AND (
      (r.start_date <= check_end_date AND r.end_date >= check_start_date)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate rental invoice data
CREATE OR REPLACE FUNCTION generate_rental_invoice(rental_uuid uuid)
RETURNS TABLE (
  rental_id uuid,
  invoice_number text,
  product_name text,
  product_category text,
  renter_name text,
  renter_email text,
  host_name text,
  host_email text,
  start_date date,
  end_date date,
  total_days integer,
  daily_rate numeric,
  subtotal numeric,
  service_fee numeric,
  insurance_fee numeric,
  total_amount numeric,
  payment_status payment_status,
  created_date timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id as rental_id,
    'INV-' || EXTRACT(YEAR FROM r.created_at) || '-' || LPAD(EXTRACT(DOY FROM r.created_at)::text, 3, '0') || '-' || LPAD(r.id::text, 8, '0') as invoice_number,
    p.name as product_name,
    p.category as product_category,
    pr_renter.name as renter_name,
    pr_renter.email as renter_email,
    pr_host.name as host_name,
    pr_host.email as host_email,
    r.start_date,
    r.end_date,
    r.total_days,
    r.price_per_day as daily_rate,
    r.total_amount as subtotal,
    r.service_fee,
    r.insurance_fee,
    r.total_amount + r.service_fee + r.insurance_fee as total_amount,
    r.payment_status,
    r.created_at as created_date
  FROM rentals r
  JOIN products p ON r.product_id = p.id
  JOIN profiles pr_renter ON r.renter_id = pr_renter.id
  JOIN profiles pr_host ON r.host_id = pr_host.id
  WHERE r.id = rental_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old notifications (keep last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM notifications 
  WHERE created_at < CURRENT_DATE - INTERVAL '90 days'
    AND read = true;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user activity summary
CREATE OR REPLACE FUNCTION get_user_activity_summary(user_uuid uuid)
RETURNS TABLE (
  total_rentals_as_renter bigint,
  total_rentals_as_host bigint,
  total_products_listed bigint,
  total_reviews_given bigint,
  total_reviews_received bigint,
  average_rating_as_host numeric,
  total_earnings numeric,
  total_spent numeric,
  favorite_categories text[],
  join_date timestamptz,
  last_activity timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM rentals WHERE renter_id = user_uuid) as total_rentals_as_renter,
    (SELECT COUNT(*) FROM rentals WHERE host_id = user_uuid) as total_rentals_as_host,
    (SELECT COUNT(*) FROM products WHERE owner_id = user_uuid) as total_products_listed,
    (SELECT COUNT(*) FROM reviews WHERE reviewer_id = user_uuid) as total_reviews_given,
    (SELECT COUNT(*) FROM reviews WHERE reviewee_id = user_uuid) as total_reviews_received,
    (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE reviewee_id = user_uuid AND review_type = 'host') as average_rating_as_host,
    (SELECT COALESCE(SUM(total_amount), 0) FROM rentals WHERE host_id = user_uuid AND status = 'completed') as total_earnings,
    (SELECT COALESCE(SUM(total_amount), 0) FROM rentals WHERE renter_id = user_uuid AND status = 'completed') as total_spent,
    (SELECT ARRAY_AGG(DISTINCT p.category) FROM products p JOIN rentals r ON p.id = r.product_id WHERE r.renter_id = user_uuid) as favorite_categories,
    (SELECT created_at FROM profiles WHERE id = user_uuid) as join_date,
    (SELECT GREATEST(
      COALESCE(MAX(r1.created_at), '1970-01-01'::timestamptz),
      COALESCE(MAX(r2.created_at), '1970-01-01'::timestamptz),
      COALESCE(MAX(rev.created_at), '1970-01-01'::timestamptz),
      COALESCE(MAX(f.created_at), '1970-01-01'::timestamptz)
    ) FROM rentals r1 
    FULL OUTER JOIN rentals r2 ON r2.host_id = user_uuid
    FULL OUTER JOIN reviews rev ON rev.reviewer_id = user_uuid
    FULL OUTER JOIN favorites f ON f.user_id = user_uuid
    WHERE r1.renter_id = user_uuid) as last_activity;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;