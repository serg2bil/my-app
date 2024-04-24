import { configureStore } from '@reduxjs/toolkit';
import countReducer from './countSlice';
import userReducer from './users'

export default configureStore({
  reducer: {
    counts: countReducer,
    user_data: userReducer,
  },
});