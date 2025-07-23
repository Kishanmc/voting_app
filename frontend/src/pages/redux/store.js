import { configureStore } from '@reduxjs/toolkit';
import candidateReducer from './candidate/candidateSlice';

export const store = configureStore({
  reducer: {
    candidate: candidateReducer,
  },
});
