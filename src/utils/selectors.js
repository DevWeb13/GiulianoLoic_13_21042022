/**
 * SelectUser is a function that takes a state and returns the user property of that state.
 * @param state - The state of the Redux store.
 */
export const selectUser = (/** @type {{ user: any; }} */ state) => state.user;
