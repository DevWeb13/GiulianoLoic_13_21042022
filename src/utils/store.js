import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../features/login";
import apiResponseReducer from "../features/apiResponse";
import profileReducer from "../features/profile";

const store = configureStore({
  reducer: {
    login: loginReducer,
    apiResponse: apiResponseReducer,
    profile: profileReducer,
  },
});

export default store;
