import { Product } from '../types/product';

type DBProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  price_per_week: number | null;
  price_per_month: number | null;
  category: string;
  in_stock: boolean;
  stock_count: number;
  features: string[];
  tags: string[];
  images: string[];
  location_lat: number;
  location_lng: number;
  location_address: string;
  location_city: string;
  location_country: string;
  owner_id: string;
  min_rental_days: number;
  max_rental_days: number;
  rating: number | null;
  view_count: number | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    name: string;
    avatar_url: string | null;
    rating?: { rating: number }[];
  };
  reviews?: Array<{
    rating: number;
  }>;
};

export function transformProduct(dbProduct: DBProduct): Product {
  const ownerRating = dbProduct.profiles?.rating
    ? dbProduct.profiles.rating.reduce((sum, r) => sum + r.rating, 0) / dbProduct.profiles.rating.length
    : 4.5;

  const productRating = dbProduct.reviews && dbProduct.reviews.length > 0
    ? dbProduct.reviews.reduce((sum, r) => sum + r.rating, 0) / dbProduct.reviews.length
    : dbProduct.rating || 4.5;

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    pricePerWeek: dbProduct.price_per_week || undefined,
    pricePerMonth: dbProduct.price_per_month || undefined,
    rating: Number(productRating.toFixed(1)),
    reviewCount: dbProduct.reviews?.length || 0,
    image: dbProduct.images[0] || '',
    images: dbProduct.images,
    category: dbProduct.category,
    inStock: dbProduct.in_stock,
    stockCount: dbProduct.stock_count,
    tags: dbProduct.tags,
    location: {
      lat: dbProduct.location_lat,
      lng: dbProduct.location_lng,
      address: dbProduct.location_address,
      city: dbProduct.location_city,
      country: dbProduct.location_country,
    },
    owner: {
      id: dbProduct.profiles?.id || dbProduct.owner_id,
      name: dbProduct.profiles?.name || 'Unknown',
      avatar: dbProduct.profiles?.avatar_url || undefined,
      rating: Number(ownerRating.toFixed(1)),
    },
    features: dbProduct.features,
    minRentalDays: dbProduct.min_rental_days,
    maxRentalDays: dbProduct.max_rental_days,
  };
}

export function transformProducts(dbProducts: DBProduct[]): Product[] {
  return dbProducts.map(transformProduct);
}
