// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice"; // Adjust the path according to your project structure

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // You can add middleware here if needed
});

export default store;
