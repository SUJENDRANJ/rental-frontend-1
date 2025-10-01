/*
  # Create analytics views and functions

  1. Views
    - Host performance analytics
    - Product performance analytics
    - Platform statistics
    - Revenue analytics

  2. Functions
    - Generate host reports
    - Calculate platform metrics
    - Get trending data
*/

-- Create view for host analytics
CREATE OR REPLACE VIEW host_analytics AS
SELECT 
  p.id as host_id,
  p.name as host_name,
  p.email as host_email,
  p.city as host_city,
  COUNT(DISTINCT pr.id) as total_products,
  COUNT(DISTINCT pr.id) FILTER (WHERE pr.in_stock = true) as active_products,
  COUNT(DISTINCT r.id) as total_rentals,
  COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'active') as active_rentals,
  COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'completed') as completed_rentals,
  COALESCE(SUM(r.total_amount) FILTER (WHERE r.status = 'completed'), 0) as total_earnings,
  COALESCE(SUM(r.total_amount) FILTER (WHERE r.status = 'completed' AND r.created_at >= CURRENT_DATE - INTERVAL '30 days'), 0) as monthly_earnings,
  COALESCE(AVG(rev.rating) FILTER (WHERE rev.review_type = 'host'), 0) as average_host_rating,
  COUNT(rev.id) FILTER (WHERE rev.review_type = 'host') as total_host_reviews,
  p.created_at as host_since
FROM profiles p
LEFT JOIN products pr ON p.id = pr.owner_id
LEFT JOIN rentals r ON pr.id = r.product_id
LEFT JOIN reviews rev ON r.id = rev.rental_id AND rev.reviewee_id = p.id
WHERE p.role = 'host'
GROUP BY p.id, p.name, p.email, p.city, p.created_at;

-- Create view for product analytics
CREATE OR REPLACE VIEW product_analytics AS
SELECT 
  pr.id as product_id,
  pr.name as product_name,
  pr.category,
  pr.price,
  pr.rating,
  pr.review_count,
  pr.view_count,
  COUNT(r.id) as total_rentals,
  COUNT(r.id) FILTER (WHERE r.status = 'completed') as completed_rentals,
  COUNT(r.id) FILTER (WHERE r.created_at >= CURRENT_DATE - INTERVAL '30 days') as monthly_rentals,
  COALESCE(SUM(r.total_amount) FILTER (WHERE r.status = 'completed'), 0) as total_revenue,
  COALESCE(SUM(r.total_amount) FILTER (WHERE r.status = 'completed' AND r.created_at >= CURRENT_DATE - INTERVAL '30 days'), 0) as monthly_revenue,
  COUNT(f.id) as favorite_count,
  pr.created_at as listed_date,
  p.name as owner_name
FROM products pr
JOIN profiles p ON pr.owner_id = p.id
LEFT JOIN rentals r ON pr.id = r.product_id
LEFT JOIN favorites f ON pr.id = f.product_id
GROUP BY pr.id, pr.name, pr.category, pr.price, pr.rating, pr.review_count, pr.view_count, pr.created_at, p.name;

-- Create view for platform statistics
CREATE OR REPLACE VIEW platform_statistics AS
SELECT 
  (SELECT COUNT(*) FROM profiles WHERE role = 'renter') as total_renters,
  (SELECT COUNT(*) FROM profiles WHERE role = 'host') as total_hosts,
  (SELECT COUNT(*) FROM profiles WHERE kyc_status = 'approved') as verified_users,
  (SELECT COUNT(*) FROM products WHERE in_stock = true) as active_products,
  (SELECT COUNT(*) FROM rentals) as total_rentals,
  (SELECT COUNT(*) FROM rentals WHERE status = 'active') as active_rentals,
  (SELECT COUNT(*) FROM rentals WHERE status = 'completed') as completed_rentals,
  (SELECT COALESCE(SUM(total_amount), 0) FROM rentals WHERE status = 'completed') as total_platform_revenue,
  (SELECT COALESCE(SUM(total_amount), 0) FROM rentals WHERE status = 'completed' AND created_at >= CURRENT_DATE - INTERVAL '30 days') as monthly_revenue,
  (SELECT COALESCE(AVG(rating), 0) FROM products WHERE review_count > 0) as average_product_rating,
  (SELECT COUNT(*) FROM reviews) as total_reviews,
  (SELECT COUNT(*) FROM favorites) as total_favorites;

-- Function to get host performance report
CREATE OR REPLACE FUNCTION get_host_performance_report(
  host_user_id uuid,
  start_date date DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date date DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  metric text,
  current_period numeric,
  previous_period numeric,
  change_percent numeric
) AS $$
DECLARE
  period_days integer;
BEGIN
  period_days := end_date - start_date;
  
  RETURN QUERY
  WITH current_stats AS (
    SELECT 
      COUNT(DISTINCT r.id) as rentals,
      COALESCE(SUM(r.total_amount) FILTER (WHERE r.status = 'completed'), 0) as revenue,
      COUNT(DISTINCT r.renter_id) as unique_renters,
      COALESCE(AVG(rev.rating), 0) as avg_rating
    FROM rentals r
    LEFT JOIN reviews rev ON r.id = rev.rental_id AND rev.review_type = 'host'
    WHERE r.host_id = host_user_id
      AND r.created_at BETWEEN start_date AND end_date
  ),
  previous_stats AS (
    SELECT 
      COUNT(DISTINCT r.id) as rentals,
      COALESCE(SUM(r.total_amount) FILTER (WHERE r.status = 'completed'), 0) as revenue,
      COUNT(DISTINCT r.renter_id) as unique_renters,
      COALESCE(AVG(rev.rating), 0) as avg_rating
    FROM rentals r
    LEFT JOIN reviews rev ON r.id = rev.rental_id AND rev.review_type = 'host'
    WHERE r.host_id = host_user_id
      AND r.created_at BETWEEN (start_date - (period_days || ' days')::interval) AND (end_date - (period_days || ' days')::interval)
  )
  SELECT 
    'Total Rentals' as metric,
    c.rentals as current_period,
    p.rentals as previous_period,
    CASE WHEN p.rentals > 0 THEN ((c.rentals - p.rentals) / p.rentals * 100) ELSE 0 END as change_percent
  FROM current_stats c, previous_stats p
  
  UNION ALL
  
  SELECT 
    'Total Revenue' as metric,
    c.revenue as current_period,
    p.revenue as previous_period,
    CASE WHEN p.revenue > 0 THEN ((c.revenue - p.revenue) / p.revenue * 100) ELSE 0 END as change_percent
  FROM current_stats c, previous_stats p
  
  UNION ALL
  
  SELECT 
    'Unique Renters' as metric,
    c.unique_renters as current_period,
    p.unique_renters as previous_period,
    CASE WHEN p.unique_renters > 0 THEN ((c.unique_renters - p.unique_renters) / p.unique_renters * 100) ELSE 0 END as change_percent
  FROM current_stats c, previous_stats p
  
  UNION ALL
  
  SELECT 
    'Average Rating' as metric,
    c.avg_rating as current_period,
    p.avg_rating as previous_period,
    CASE WHEN p.avg_rating > 0 THEN ((c.avg_rating - p.avg_rating) / p.avg_rating * 100) ELSE 0 END as change_percent
  FROM current_stats c, previous_stats p;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get category performance
CREATE OR REPLACE FUNCTION get_category_performance()
RETURNS TABLE (
  category text,
  total_products bigint,
  active_products bigint,
  total_rentals bigint,
  total_revenue numeric,
  average_rating numeric,
  average_price numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.category,
    COUNT(DISTINCT p.id) as total_products,
    COUNT(DISTINCT p.id) FILTER (WHERE p.in_stock = true) as active_products,
    COUNT(r.id) as total_rentals,
    COALESCE(SUM(r.total_amount) FILTER (WHERE r.status = 'completed'), 0) as total_revenue,
    COALESCE(AVG(p.rating), 0) as average_rating,
    COALESCE(AVG(p.price), 0) as average_price
  FROM products p
  LEFT JOIN rentals r ON p.id = r.product_id
  GROUP BY p.category
  ORDER BY total_revenue DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get monthly revenue trends
CREATE OR REPLACE FUNCTION get_monthly_revenue_trends(
  months_back integer DEFAULT 12
)
RETURNS TABLE (
  month_year text,
  total_revenue numeric,
  rental_count bigint,
  average_rental_value numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(DATE_TRUNC('month', r.created_at), 'YYYY-MM') as month_year,
    COALESCE(SUM(r.total_amount) FILTER (WHERE r.status = 'completed'), 0) as total_revenue,
    COUNT(r.id) as rental_count,
    CASE 
      WHEN COUNT(r.id) > 0 THEN COALESCE(SUM(r.total_amount) FILTER (WHERE r.status = 'completed'), 0) / COUNT(r.id)
      ELSE 0 
    END as average_rental_value
  FROM rentals r
  WHERE r.created_at >= CURRENT_DATE - (months_back || ' months')::interval
  GROUP BY DATE_TRUNC('month', r.created_at)
  ORDER BY month_year ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create materialized view for dashboard metrics (refreshed periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_metrics AS
SELECT 
  'platform_stats' as metric_type,
  json_build_object(
    'total_users', (SELECT COUNT(*) FROM profiles),
    'total_hosts', (SELECT COUNT(*) FROM profiles WHERE role = 'host'),
    'total_products', (SELECT COUNT(*) FROM products),
    'active_products', (SELECT COUNT(*) FROM products WHERE in_stock = true),
    'total_rentals', (SELECT COUNT(*) FROM rentals),
    'monthly_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM rentals WHERE status = 'completed' AND created_at >= CURRENT_DATE - INTERVAL '30 days'),
    'average_rating', (SELECT COALESCE(AVG(rating), 0) FROM products WHERE review_count > 0)
  ) as metrics,
  NOW() as last_updated

UNION ALL

SELECT 
  'top_categories' as metric_type,
  json_agg(
    json_build_object(
      'category', category,
      'product_count', product_count,
      'revenue', revenue
    ) ORDER BY revenue DESC
  ) as metrics,
  NOW() as last_updated
FROM (
  SELECT 
    p.category,
    COUNT(p.id) as product_count,
    COALESCE(SUM(r.total_amount) FILTER (WHERE r.status = 'completed'), 0) as revenue
  FROM products p
  LEFT JOIN rentals r ON p.id = r.product_id
  GROUP BY p.category
  LIMIT 10
) cat_stats;

-- Function to refresh dashboard metrics
CREATE OR REPLACE FUNCTION refresh_dashboard_metrics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW dashboard_metrics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS dashboard_metrics_type_idx ON dashboard_metrics (metric_type);