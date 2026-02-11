import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAdmin: boolean;
  token: string | null;
}

const initialState: AuthState = {
  isAdmin: false,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAdmin = true;
    },
    clearAuth: (state) => {
      state.token = null;
      state.isAdmin = false;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
