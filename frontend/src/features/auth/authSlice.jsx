import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../Constants';


const initialState = {
  accessToken: localStorage.getItem(ACCESS_TOKEN) || null,
  refreshToken: localStorage.getItem(REFRESH_TOKEN) || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem(ACCESS_TOKEN),
};


export const loginUser = createAsyncThunk('auth/login', async ({ username, password }, thunkAPI) => {
  try {
    const response = await api.post('/users/token/', { username, password });
    localStorage.setItem(ACCESS_TOKEN, response.data.access);
    localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Login failed');
  }
});


export const registerUser = createAsyncThunk('auth/register', async ({ username, password }, thunkAPI) => {
  try {
    await api.post('/users/user/register/', { username, password });
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Registration failed');
  }
});


export const logoutUser = () => (dispatch) => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  dispatch(logout());
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
