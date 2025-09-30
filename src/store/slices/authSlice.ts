import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'renter' | 'host';
  kycStatus?: 'pending' | 'approved' | 'rejected';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginFailure: (state) => {
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    switchRole: (state, action: PayloadAction<'renter' | 'host'>) => {
      if (state.user) {
        state.user.role = action.payload;
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, switchRole } = authSlice.actions;
export default authSlice.reducer;