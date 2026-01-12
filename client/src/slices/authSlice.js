import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const res = await axios.post('/api/auth/login', credentials);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const res = await axios.post('/api/auth/register', userData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await axios.post('/api/auth/logout');
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    clearCredentials: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
        .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(logout.fulfilled, (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
