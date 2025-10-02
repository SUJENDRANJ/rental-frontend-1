/*
  # Complete Rental Platform Schema for RentHub India
  
  This migration creates all remaining tables and functionality for the production rental platform.
  
  ## Tables Created
  1. products - Rental items listing
  2. rentals - Booking and rental management
  3. favorites - User wishlist
  4. reviews - Product and user reviews
  5. notifications - In-app notifications
  6. kyc_verifications - KYC for host verification
  7. hero_banners - Admin-managed homepage banners
  8. admin_content - CMS for homepage content
  9. payment_transactions - Payment tracking with Razorpay
  10. reports - User reporting system
  11. admin_audit_logs - Admin action tracking
  12. sms_otp_log - SMS OTP audit trail
*/

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE rental_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');
CREATE TYPE review_type AS ENUM ('product', 'host', 'renter');
CREATE TYPE notification_type AS ENUM ('booking', 'payment', 'system', 'host', 'review');
CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE kyc_verification_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');
CREATE TYPE payment_transaction_status AS ENUM ('created', 'authorized', 'captured', 'refunded', 'failed');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE report_type AS ENUM ('inappropriate_content', 'fraud', 'harassment', 'spam', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'investigating', 'resolved', 'dismissed');
CREATE TYPE sms_status AS ENUM ('sent', 'verified', 'expired', 'failed');

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================

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
  location_country text DEFAULT 'India',
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating decimal(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products viewable by everyone" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own products" ON products FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own products" ON products FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own products" ON products FOR DELETE TO authenticated USING (auth.uid() = owner_id);

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX products_owner_id_idx ON products(owner_id);
CREATE INDEX products_category_idx ON products(category);
CREATE INDEX products_in_stock_idx ON products(in_stock);
CREATE INDEX products_location_idx ON products(location_lat, location_lng);
CREATE INDEX products_created_at_idx ON products(created_at DESC);

-- =====================================================
-- RENTALS TABLE
-- =====================================================

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

ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view rentals as renter" ON rentals FOR SELECT TO authenticated USING (auth.uid() = renter_id);
CREATE POLICY "Users view rentals as host" ON rentals FOR SELECT TO authenticated USING (auth.uid() = host_id);
CREATE POLICY "Users insert rentals as renter" ON rentals FOR INSERT TO authenticated WITH CHECK (auth.uid() = renter_id);
CREATE POLICY "Users update rentals as renter" ON rentals FOR UPDATE TO authenticated USING (auth.uid() = renter_id);
CREATE POLICY "Users update rentals as host" ON rentals FOR UPDATE TO authenticated USING (auth.uid() = host_id);

CREATE TRIGGER update_rentals_updated_at BEFORE UPDATE ON rentals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX rentals_product_id_idx ON rentals(product_id);
CREATE INDEX rentals_renter_id_idx ON rentals(renter_id);
CREATE INDEX rentals_host_id_idx ON rentals(host_id);
CREATE INDEX rentals_status_idx ON rentals(status);
CREATE INDEX rentals_dates_idx ON rentals(start_date, end_date);
CREATE INDEX rentals_created_at_idx ON rentals(created_at DESC);

-- =====================================================
-- FAVORITES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own favorites" ON favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own favorites" ON favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own favorites" ON favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX favorites_user_id_idx ON favorites(user_id);
CREATE INDEX favorites_product_id_idx ON favorites(product_id);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================

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

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews viewable by everyone" ON reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert reviews for rentals" ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users update own reviews" ON reviews FOR UPDATE TO authenticated USING (auth.uid() = reviewer_id);

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX reviews_rental_id_idx ON reviews(rental_id);
CREATE INDEX reviews_reviewer_id_idx ON reviews(reviewer_id);
CREATE INDEX reviews_reviewee_id_idx ON reviews(reviewee_id);
CREATE INDEX reviews_product_id_idx ON reviews(product_id);
CREATE INDEX reviews_created_at_idx ON reviews(created_at DESC);

-- Update product rating function
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE products SET 
    rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND review_type = 'product'),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND review_type = 'product')
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_product_rating_insert AFTER INSERT ON reviews FOR EACH ROW WHEN (NEW.review_type = 'product') EXECUTE FUNCTION update_product_rating();
CREATE TRIGGER update_product_rating_update AFTER UPDATE ON reviews FOR EACH ROW WHEN (NEW.review_type = 'product') EXECUTE FUNCTION update_product_rating();
CREATE TRIGGER update_product_rating_delete AFTER DELETE ON reviews FOR EACH ROW WHEN (OLD.review_type = 'product') EXECUTE FUNCTION update_product_rating();

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  priority notification_priority DEFAULT 'medium',
  related_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own notifications" ON notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_read_idx ON notifications(read);
CREATE INDEX notifications_created_at_idx ON notifications(created_at DESC);

CREATE OR REPLACE FUNCTION create_notification(
  p_user_id uuid, p_type notification_type, p_title text, p_message text,
  p_priority notification_priority DEFAULT 'medium', p_related_id uuid DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE notification_id uuid;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, priority, related_id)
  VALUES (p_user_id, p_type, p_title, p_message, p_priority, p_related_id)
  RETURNING id INTO notification_id;
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- KYC VERIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS kyc_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  phone_number text,
  phone_verified boolean DEFAULT false,
  phone_otp text,
  phone_otp_expires_at timestamptz,
  phone_otp_attempts integer DEFAULT 0,
  video_url text,
  video_public_id text,
  government_id_type text,
  government_id_url text,
  government_id_public_id text,
  status kyc_verification_status DEFAULT 'pending',
  rejection_reason text,
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own KYC" ON kyc_verifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own KYC" ON kyc_verifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own pending KYC" ON kyc_verifications FOR UPDATE TO authenticated USING (auth.uid() = user_id AND status = 'pending');

CREATE TRIGGER update_kyc_verifications_updated_at BEFORE UPDATE ON kyc_verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX kyc_user_id_idx ON kyc_verifications(user_id);
CREATE INDEX kyc_status_idx ON kyc_verifications(status);
CREATE INDEX kyc_phone_idx ON kyc_verifications(phone_number);

-- =====================================================
-- HERO BANNERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS hero_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  image_url text NOT NULL,
  image_public_id text,
  cta_text text DEFAULT 'Learn More',
  cta_link text DEFAULT '/',
  priority integer DEFAULT 0,
  is_active boolean DEFAULT true,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  click_count integer DEFAULT 0,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active banners viewable by everyone" ON hero_banners FOR SELECT TO authenticated
  USING (is_active = true AND (start_date IS NULL OR start_date <= CURRENT_DATE) AND (end_date IS NULL OR end_date >= CURRENT_DATE));

CREATE TRIGGER update_hero_banners_updated_at BEFORE UPDATE ON hero_banners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX hero_banners_priority_idx ON hero_banners(priority ASC);
CREATE INDEX hero_banners_active_idx ON hero_banners(is_active);

-- =====================================================
-- ADMIN CONTENT TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  title text,
  content text,
  metadata jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  updated_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active content viewable by everyone" ON admin_content FOR SELECT TO authenticated USING (is_active = true);

CREATE TRIGGER update_admin_content_updated_at BEFORE UPDATE ON admin_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX admin_content_section_key_idx ON admin_content(section_key);

-- =====================================================
-- PAYMENT TRANSACTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id uuid REFERENCES rentals(id) ON DELETE CASCADE NOT NULL,
  razorpay_order_id text UNIQUE,
  razorpay_payment_id text,
  razorpay_signature text,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'INR',
  payment_method text,
  status payment_transaction_status DEFAULT 'created',
  platform_fee decimal(10,2) DEFAULT 0,
  host_payout decimal(10,2) DEFAULT 0,
  payout_status payout_status DEFAULT 'pending',
  payout_date timestamptz,
  refund_amount decimal(10,2) DEFAULT 0,
  refund_reason text,
  failure_reason text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view payments as renter" ON payment_transactions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM rentals WHERE id = payment_transactions.rental_id AND renter_id = auth.uid()));

CREATE POLICY "Users view payments as host" ON payment_transactions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM rentals WHERE id = payment_transactions.rental_id AND host_id = auth.uid()));

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX payment_rental_id_idx ON payment_transactions(rental_id);
CREATE INDEX payment_razorpay_order_id_idx ON payment_transactions(razorpay_order_id);
CREATE INDEX payment_status_idx ON payment_transactions(status);

-- =====================================================
-- REPORTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reported_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reported_product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  reported_review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  report_type report_type NOT NULL,
  description text NOT NULL,
  status report_status DEFAULT 'pending',
  resolution_note text,
  resolved_by uuid REFERENCES profiles(id),
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own reports" ON reports FOR SELECT TO authenticated USING (reporter_id = auth.uid());
CREATE POLICY "Users create reports" ON reports FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());

CREATE INDEX reports_reporter_id_idx ON reports(reporter_id);
CREATE INDEX reports_status_idx ON reports(status);

-- =====================================================
-- ADMIN AUDIT LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES profiles(id) NOT NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX audit_admin_id_idx ON admin_audit_logs(admin_id);
CREATE INDEX audit_created_at_idx ON admin_audit_logs(created_at DESC);

-- =====================================================
-- SMS OTP LOG TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS sms_otp_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL,
  otp_code text NOT NULL,
  status sms_status DEFAULT 'sent',
  attempts integer DEFAULT 0,
  provider text DEFAULT 'MSG91',
  provider_message_id text,
  expires_at timestamptz NOT NULL,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sms_otp_log ENABLE ROW LEVEL SECURITY;

CREATE INDEX sms_otp_phone_idx ON sms_otp_log(phone_number);
CREATE INDEX sms_otp_created_at_idx ON sms_otp_log(created_at DESC);

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Calculate 15% platform commission
CREATE OR REPLACE FUNCTION calculate_platform_commission(p_rental_amount decimal)
RETURNS TABLE (subtotal decimal, platform_fee decimal, host_payout decimal) AS $$
BEGIN
  RETURN QUERY SELECT 
    p_rental_amount as subtotal,
    ROUND(p_rental_amount * 0.15, 2) as platform_fee,
    ROUND(p_rental_amount * 0.85, 2) as host_payout;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify phone OTP
CREATE OR REPLACE FUNCTION verify_phone_otp(p_user_id uuid, p_otp_code text)
RETURNS boolean AS $$
DECLARE v_kyc_record RECORD;
BEGIN
  SELECT * INTO v_kyc_record FROM kyc_verifications WHERE user_id = p_user_id;
  IF NOT FOUND OR v_kyc_record.phone_otp != p_otp_code OR v_kyc_record.phone_otp_expires_at < now() THEN
    RETURN false;
  END IF;
  UPDATE kyc_verifications SET phone_verified = true, phone_otp = NULL, phone_otp_expires_at = NULL, phone_otp_attempts = 0 WHERE user_id = p_user_id;
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Process KYC approval
CREATE OR REPLACE FUNCTION process_kyc_approval(p_kyc_id uuid, p_admin_id uuid, p_approved boolean, p_rejection_reason text DEFAULT NULL)
RETURNS void AS $$
DECLARE v_user_id uuid;
BEGIN
  SELECT user_id INTO v_user_id FROM kyc_verifications WHERE id = p_kyc_id;
  IF p_approved THEN
    UPDATE kyc_verifications SET status = 'approved', reviewed_by = p_admin_id, reviewed_at = now() WHERE id = p_kyc_id;
    UPDATE profiles SET role = 'host', kyc_status = 'approved', identity_verified = true WHERE id = v_user_id;
    PERFORM create_notification(v_user_id, 'system', 'KYC Approved', 'Congratulations! Your KYC verification has been approved. You can now list products as a host.', 'high');
  ELSE
    UPDATE kyc_verifications SET status = 'rejected', rejection_reason = p_rejection_reason, reviewed_by = p_admin_id, reviewed_at = now() WHERE id = p_kyc_id;
    UPDATE profiles SET kyc_status = 'rejected' WHERE id = v_user_id;
    PERFORM create_notification(v_user_id, 'system', 'KYC Rejected', 'Your KYC verification was not approved. Reason: ' || COALESCE(p_rejection_reason, 'Please contact support.'), 'high');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default admin content
INSERT INTO admin_content (section_key, title, content, metadata, is_active) VALUES
  ('homepage_hero_main', 'Rent Anything, Anytime', 'Discover quality items from trusted hosts in your community across India', '{"cta_text": "Browse Items", "cta_link": "/products"}'::jsonb, true),
  ('homepage_about', 'About RentHub', 'Your trusted marketplace for renting and sharing items across India', '{}'::jsonb, true),
  ('homepage_how_it_works', 'How It Works', 'Simple steps to start renting or hosting', '{}'::jsonb, true)
ON CONFLICT (section_key) DO NOTHING;