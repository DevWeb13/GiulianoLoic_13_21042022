import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    login: null,
  },
  reducers: {
    userLogin: (state, action) => {
      state.login = action.payload;
    },
    userLogout: (state, action) => {
      state.login = null;
    },
  },
});

export const { userLogin, userLogout } = loginSlice.actions;

export const selectLogin = (state) => state.login.login;

export default loginSlice.reducer;
