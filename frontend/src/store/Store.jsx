import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import adminAuthReducer from '../features/auth/adminAuthSlice'
import usersReducer from '../features/auth/usersSlice'


const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminAuthReducer,
    users: usersReducer
  },
});

export default store;