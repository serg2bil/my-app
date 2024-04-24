import { configureStore } from '@reduxjs/toolkit';
import countReducer from './countSlice.js';
import userReducer from './users.js'

export default configureStore({
  reducer: {
    counts: countReducer,
    user_data: userReducer,
  },
});