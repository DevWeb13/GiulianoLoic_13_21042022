import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    userLogin: (state, action) => {
      state.user = action.payload;
    },
    userLogout: (state, _action) => {
      state.user = null;
    },
    userSettings: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { userLogin, userLogout, userSettings } = userSlice.actions;

export const selectLogin = (state) => state.login.login;

export default userSlice.reducer;
