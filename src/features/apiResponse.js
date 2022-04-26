import { createSlice } from "@reduxjs/toolkit";

export const apiResponseSlice = createSlice({
  name: "apiResponse",
  initialState: {
    apiResponse: null,
  },
  reducers: {
    apiResponseLogin: (state, action) => {
      state.apiResponse = action.payload;
    },
    apiResponseLogout: (state, _action) => {
      state.apiResponse = null;
    },
  },
});

export const { apiResponseLogin, apiResponseLogout } = apiResponseSlice.actions;

export const selectApiResponse = (state) => state.apiResponse;

export default apiResponseSlice.reducer;
