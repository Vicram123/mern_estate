import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice"; // Corrected import name
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({ user: userReducer }); // Use the correct reducer name

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create a Redux store using configureStore from Redux Toolkit
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }), // Disable the serializable check for non-serializable values
});

export const persistor = persistStore(store);
