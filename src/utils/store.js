import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../features/login";
import apiResponseReducer from "../features/apiResponse";

const store = configureStore({
  reducer: {
    login: loginReducer,
    apiResponse: apiResponseReducer,
  },
});

export default store;
