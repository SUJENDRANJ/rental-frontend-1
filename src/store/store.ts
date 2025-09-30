import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import productsSlice from './slices/productsSlice';
import themeSlice from './slices/themeSlice';
import rentalSlice from './slices/rentalSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productsSlice,
    theme: themeSlice,
    rental: rentalSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;