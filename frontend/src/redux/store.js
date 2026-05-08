import { configureStore } from '@reduxjs/toolkit';
import candidateReducer from './slices/candidateSlice';

export const store = configureStore({
  reducer: {
    candidate: candidateReducer,
  },
});
