import { selectUser } from "./selectors";
import {
  userTokenFetching,
  userTokenResolved,
  userTokenRejected,
  userDataFetching,
  userDataResolved,
  userDataRejected,
  userLogout,
  userRememberMe,
  userEditProfile,
} from "../features/user";

/**
 * It fetches a token from the server, and if successful, it dispatches an action to update the token
 * in the Redux store
 * @param  {{ dispatch: any; getState: any; }} store - the redux store
 * @param {String} email - The email of the user
 * @param {String} password - The password of the user
 * @returns The token is being returned.
 */
export async function fetchOrUpdateToken(store, email, password) {
  const tokenStatus = selectUser(store.getState()).tokenStatus;
  const rememberMeValue = selectUser(store.getState()).rememberMe;
  if (tokenStatus === "pending" || tokenStatus === "updating") {
    return;
  }
  store.dispatch(userTokenFetching());
  const optionsToken = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };
  try {
    const response = await fetch(
      "http://localhost:3001/api/v1/user/login",
      optionsToken
    );
    const res = await response.json();
    store.dispatch(userTokenResolved(res.body.token));
    if (rememberMeValue) {
      localStorage.setItem("token", res.body.token);
      sessionStorage.setItem("token", res.body.token);
    }
    return res.body.token;
  } catch (error) {
    store.dispatch(userTokenRejected(error));
    return null;
  }
}

/**
 * It fetches the user's profile data from the server and updates the Redux store with the data
 * @param {{ dispatch: any; getState: any; }} store - the redux store
 * @param {string} token - The token that was passed to the function.
 * @returns a promise.
 */
export async function fetchOrUpdateData(store, token) {
  if (token === null) {
    return;
  }
  const dataStatus = selectUser(store.getState()).dataStatus;
  if (dataStatus === "pending" || dataStatus === "updating") {
    return;
  }
  store.dispatch(userDataFetching());
  const requestForProfileHeaders = {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await fetch(
      "http://localhost:3001/api/v1/user/profile",
      requestForProfileHeaders
    );
    const res = await response.json();
    if (res.message === "invalid token") {
      signOut(store);
      return;
    }
    store.dispatch(userDataResolved(res.body));
  } catch (error) {
    store.dispatch(userDataRejected(error));
  }
}

/**
 * If there's a token in localStorage or sessionStorage, dispatch the userTokenFetching action,
 * dispatch the userTokenResolved action, dispatch the userRememberMe action, and fetch or update the
 * data
 * @param {{ dispatch: any; getState: any; }} store - the redux store
 */
export function checkStorageToken(store) {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    store.dispatch(userTokenFetching());
    store.dispatch(userTokenResolved(token));
    store.dispatch(userRememberMe());
    fetchOrUpdateData(store, token);
  }
}

/**
 * It dispatches a userLogout action, removes the token from localStorage and sessionStorage, and then
 * returns undefined
 * @param {{ getState?: any; dispatch: any; }} store - The Redux store
 */
export function signOut(store) {
  store.dispatch(userLogout());
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
}

/**
 * If the user has a token, then dispatch the userRememberMe action.
 * @param store - The Redux store.
 */
export function rememberMe(store) {
  store.dispatch(userRememberMe());
}

/**
 * Updated user data
 *
 * @param   {Object}  store      Store
 * @param   {String}  firstName  New first name of the user
 * @param   {String}  lastName   New last name of the user
 * @param   {String}  token      Token of the user
 *
 * @return  {Promise}             Updated user data
 */
export async function editProfile(store, firstName, lastName, token) {
  const optionsEditProfile = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ firstName, lastName }),
  };
  try {
    await fetch(
      "http://localhost:3001/api/v1/user/profile",
      optionsEditProfile
    );
    store.dispatch(userEditProfile(firstName, lastName));
  } catch (error) {
    store.dispatch(userDataRejected(error));
  }
}
