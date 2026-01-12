import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import gigReducer from '../slices/gigSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    gig: gigReducer,
  },
  devTools: true,
});

export default store;
