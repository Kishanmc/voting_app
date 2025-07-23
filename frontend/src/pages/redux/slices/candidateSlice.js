import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCandidatesAPI,
  voteCandidateAPI,
  searchCandidateAPI,
  addCandidateAPI,
} from './candidateAPI';

export const fetchCandidates = createAsyncThunk(
  'candidate/fetchCandidates',
  async (_, thunkAPI) => {
    try {
      const res = await fetchCandidatesAPI();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

export const voteCandidate = createAsyncThunk(
  'candidate/voteCandidate',
  async (candidateId, thunkAPI) => {
    try {
      const res = await voteCandidateAPI(candidateId);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Vote failed');
    }
  }
);

export const searchCandidates = createAsyncThunk(
  'candidate/searchCandidates',
  async (query, thunkAPI) => {
    try {
      const res = await searchCandidateAPI(query);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Search failed');
    }
  }
);

export const addCandidate = createAsyncThunk(
  'candidate/addCandidate',
  async (candidateData, thunkAPI) => {
    try {
      const res = await addCandidateAPI(candidateData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Add failed');
    }
  }
);

const candidateSlice = createSlice({
  name: 'candidate',
  initialState: {
    candidates: [],
    status: 'idle',
    error: null,
    voteMessage: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.candidates = action.payload.candidates;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(voteCandidate.fulfilled, (state, action) => {
        state.voteMessage = action.payload.message;
      })
      .addCase(voteCandidate.rejected, (state, action) => {
        state.voteMessage = action.payload;
      })

      .addCase(searchCandidates.fulfilled, (state, action) => {
        state.candidates = action.payload.candidates;
      })

      .addCase(addCandidate.fulfilled, (state, action) => {
        state.candidates.push(action.payload.candidate);
      });
  },
});

export default candidateSlice.reducer;

// ✅ Only export these once, and don't duplicate

