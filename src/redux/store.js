// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import electionReducer from './electionSlice';

const store = configureStore({
  reducer: {
    election: electionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for Thirdweb objects which may not be serializable
    }),
});

export default store;