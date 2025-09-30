export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // price per day for rental
  pricePerWeek?: number;
  pricePerMonth?: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[]; // multiple images
  category: string;
  inStock: boolean;
  stockCount: number;
  tags: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
  };
  owner: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  features: string[];
  minRentalDays: number;
  maxRentalDays: number;
}

export interface CartItem extends Product {
  quantity: number;
  rentalDays: number;
  startDate: string;
  endDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'renter' | 'host';
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}