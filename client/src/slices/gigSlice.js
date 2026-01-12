import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  gigs: [],
  currentGig: null,
  loading: false,
  error: null,
};

export const fetchGigs = createAsyncThunk('gig/fetchAll', async (params, { rejectWithValue }) => {
    try {
        const { keyword, status } = params || {};
        let url = '/api/gigs?';
        if (keyword) url += `keyword=${keyword}&`;
        if (status) url += `status=${status}&`;
        
        const res = await axios.get(url);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

export const fetchGigById = createAsyncThunk('gig/fetchOne', async (id, { rejectWithValue }) => {
    try {
        const res = await axios.get(`/api/gigs/${id}`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

export const createGig = createAsyncThunk('gig/create', async (gigData, { rejectWithValue }) => {
    try {
        const res = await axios.post('/api/gigs', gigData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

const gigSlice = createSlice({
  name: 'gig',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(fetchGigs.pending, (state) => { state.loading = true; })
        .addCase(fetchGigs.fulfilled, (state, action) => {
            state.loading = false;
            state.gigs = action.payload;
        })
        .addCase(fetchGigs.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchGigById.pending, (state) => { state.loading = true; state.currentGig = null; })
        .addCase(fetchGigById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentGig = action.payload;
        })
        .addCase(createGig.fulfilled, (state, action) => {
            state.gigs.push(action.payload);
        });
  },
});

export default gigSlice.reducer;
