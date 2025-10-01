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
  sessionExpiry: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  sessionExpiry: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<User & { sessionExpiry?: string }>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.sessionExpiry = action.payload.sessionExpiry || null;
    },
    loginFailure: (state) => {
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionExpiry = null;
    },
    switchRole: (state, action: PayloadAction<'renter' | 'host'>) => {
      if (state.user) {
        state.user.role = action.payload;
      }
    },
    updateSessionExpiry: (state, action: PayloadAction<string>) => {
      state.sessionExpiry = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, switchRole, updateSessionExpiry } = authSlice.actions;
export default authSlice.reducer;