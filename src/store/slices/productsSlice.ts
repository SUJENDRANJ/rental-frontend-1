import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/product';

interface ProductsState {
  products: Product[];
  loading: boolean;
  selectedProduct: Product | null;
  searchTerm: string;
  selectedCategory: string;
  currentPage: number;
  sortBy: 'name' | 'price' | 'rating';
  sortOrder: 'asc' | 'desc';
  favorites: string[];
  priceRange: [number, number];
  selectedFeatures: string[];
  availabilityFilter: 'all' | 'available' | 'unavailable';
  locationFilter: string;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  selectedProduct: null,
  searchTerm: '',
  selectedCategory: 'All',
  currentPage: 1,
  sortBy: 'name',
  sortOrder: 'asc',
  favorites: [],
  priceRange: [0, 1000],
  selectedFeatures: [],
  availabilityFilter: 'all',
  locationFilter: '',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'price' | 'rating'>) => {
      state.sortBy = action.payload;
      state.currentPage = 1;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
      state.currentPage = 1;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      if (state.favorites.includes(productId)) {
        state.favorites = state.favorites.filter(id => id !== productId);
      } else {
        state.favorites.push(productId);
      }
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
      state.currentPage = 1;
    },
    setSelectedFeatures: (state, action: PayloadAction<string[]>) => {
      state.selectedFeatures = action.payload;
      state.currentPage = 1;
    },
    setAvailabilityFilter: (state, action: PayloadAction<'all' | 'available' | 'unavailable'>) => {
      state.availabilityFilter = action.payload;
      state.currentPage = 1;
    },
    setLocationFilter: (state, action: PayloadAction<string>) => {
      state.locationFilter = action.payload;
      state.currentPage = 1;
    },
  },
});

export const {
  setProducts,
  setLoading,
  setSelectedProduct,
  setSearchTerm,
  setSelectedCategory,
  setCurrentPage,
  setSortBy,
  setSortOrder,
  toggleFavorite,
  setPriceRange,
  setSelectedFeatures,
  setAvailabilityFilter,
  setLocationFilter,
} = productsSlice.actions;

export default productsSlice.reducer;