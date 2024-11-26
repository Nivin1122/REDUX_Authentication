import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';


export const adminLogin = createAsyncThunk(
  'adminAuth/adminLogin',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/admin-login/', { username, password });
      const { access_token, refresh_token, message } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      return { access_token, refresh_token, message };
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.error || 'Login failed');
      } else if (error.request) {
        return rejectWithValue('No response from server. Please try again.');
      }
      return rejectWithValue('Network error. Please try again later.');
    }
  }
);

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    adminAccessToken: null,
    adminRefreshToken: null,
    message: '',
    error: null,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      state.adminAccessToken = null;
      state.adminRefreshToken = null;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = '';
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminAccessToken = action.payload.access_token;
        state.adminRefreshToken = action.payload.refresh_token;
        state.message = action.payload.message;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = '';
      });
  },
});

export const { logout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
