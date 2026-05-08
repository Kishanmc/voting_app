import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCandidatesAPI,
  voteCandidateAPI,
  searchCandidateAPI,
  addCandidateAPI,
} from './candidateAPI';
import API from '../../api/api';

export const fetchCandidates = createAsyncThunk(
  'candidate/fetchCandidates',
  async ({ page = 1, limit = 6 }, thunkAPI) => {
    try {
      const res = await fetchCandidatesAPI({ page, limit });
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

export const deleteCandidate = createAsyncThunk(
  'candidate/deleteCandidate',
  async (candidateId, thunkAPI) => {
    try {
      const res = await API.delete(`/api/candidate/delete/${candidateId}`);
      return { candidateId, message: res.data.message };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Delete failed');
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
    deleteMessage: '',
    totalPages: 1,
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
        state.candidates = action.payload.candidates || [];
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(searchCandidates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchCandidates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.candidates = Array.isArray(action.payload) ? action.payload : [];
        state.totalPages = 1; // Reset pagination for search
      })
      .addCase(searchCandidates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(voteCandidate.fulfilled, (state, action) => {
        state.voteMessage = action.payload?.message || 'Vote casted';
      })
      .addCase(voteCandidate.rejected, (state, action) => {
        state.voteMessage = action.payload || 'Failed to vote';
      })

      .addCase(addCandidate.fulfilled, (state, action) => {
        const candidate = action.payload?.candidate;
        if (candidate) {
          state.candidates.push(candidate);
        }
      })

      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.candidates = state.candidates.filter(
          (c) => c._id !== action.payload.candidateId
        );
        state.deleteMessage = action.payload.message;
      })
      .addCase(deleteCandidate.rejected, (state, action) => {
        state.deleteMessage = action.payload;
      });
  },
});

export default candidateSlice.reducer;
