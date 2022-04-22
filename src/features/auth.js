import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {};

export default createReducer(initialState, (builder) => {
  // builder.addCase(login, (state, action) => {
  //   state.token = action.payload.token;
  // });
  // builder.addCase(logout, (state) => {
  //   state.token = null;
  // });
});
