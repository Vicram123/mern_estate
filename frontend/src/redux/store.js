import { configureStore } from "@reduxjs/toolkit";
import useReducer from "./user/userSlice";

// Create a Redux store using configureStore from Redux Toolkit
export const store = configureStore({
  // Define the root reducer for the store (currently empty)
  reducer: { user: useReducer },

  // Customize the middleware used in the store
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }), // Disable the serializable check for non-serializable values
});
