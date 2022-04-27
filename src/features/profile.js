import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
  },
  reducers: {
    profileLogin: (state, action) => {
      state.profile = action.payload;
    },
    profileLogout: (state, _action) => {
      state.profile = null;
    },
  },
});

export const { profileLogin, profileLogout } = profileSlice.actions;

export const selectProfile = (state) => state.profile.profile;

export default profileSlice.reducer;
