import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RentalItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  pricePerDay: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
}

interface RentalState {
  rentals: RentalItem[];
  currentRental: {
    productId: string | null;
    startDate: string;
    endDate: string;
    rentalPeriod: 'days' | 'months' | 'years';
    customDays: number;
  };
}

const initialState: RentalState = {
  rentals: [],
  currentRental: {
    productId: null,
    startDate: '',
    endDate: '',
    rentalPeriod: 'days',
    customDays: 1,
  },
};

const rentalSlice = createSlice({
  name: 'rental',
  initialState,
  reducers: {
    setCurrentRental: (state, action: PayloadAction<Partial<RentalState['currentRental']>>) => {
      state.currentRental = { ...state.currentRental, ...action.payload };
    },
    addRental: (state, action: PayloadAction<RentalItem>) => {
      state.rentals.push(action.payload);
    },
    updateRentalStatus: (state, action: PayloadAction<{ id: string; status: RentalItem['status'] }>) => {
      const rental = state.rentals.find(r => r.id === action.payload.id);
      if (rental) {
        rental.status = action.payload.status;
      }
    },
    clearCurrentRental: (state) => {
      state.currentRental = initialState.currentRental;
    },
  },
});

export const { setCurrentRental, addRental, updateRentalStatus, clearCurrentRental } = rentalSlice.actions;
export default rentalSlice.reducer;