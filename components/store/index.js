import { configureStore } from '@reduxjs/toolkit';
import countReducer from './countSlice.js';

export default configureStore({
  reducer: {
    counts: countReducer,
  },
});