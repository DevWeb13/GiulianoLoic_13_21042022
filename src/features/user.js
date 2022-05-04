import produce from "immer";
import { selectUser } from "../utils/selectors";

/* Setting the initial state of the userReducer. */
const initialState = {
  tokenStatus: "void",
  dataStatus: "void",
  token: null,
  data: null,
  tokenError: null,
  dataError: null,
  rememberMe: false,
};

/* Defining the action types. */
const TOKENFETCHING = "user/tokenFetching";
const DATAFETCHING = "user/dataFetching";
const TOKENRESOLVED = "user/tokenResolved";
const DATARESOLVED = "user/dataResolved";
const TOKENREJECTED = "user/tokenRejected";
const DATAREJECTED = "user/dataRejected";
const LOGOUT = "user/logout";
const REMEMBER = "user/remember";
const EDITPROFILE = "user/editProfile";

/**
 * A redux action creator. It returns an action object.
 */
/**
 * It returns an object with a type of TOKENFETCHING
 */
const userTokenFetching = () => ({ type: TOKENFETCHING });
/**
 * It returns an object with a type of DATAFETCHING
 */
const userDataFetching = () => ({ type: DATAFETCHING });
/**
 * It returns an object with a type of TOKENRESOLVED and a payload of token
 * @param token - The token that is being passed to the reducer.
 */
const userTokenResolved = (token) => ({ type: TOKENRESOLVED, payload: token });
/**
 * It returns an object with a type of DATARESOLVED and a payload of data
 * @param data - The data that is being passed to the reducer.
 */
const userDataResolved = (data) => ({ type: DATARESOLVED, payload: data });
/**
 * It returns an object with a type of TOKENREJECTED and a payload of tokenError
 * @param tokenError - The error message that will be displayed to the user.
 */
const userTokenRejected = (tokenError) => ({
  type: TOKENREJECTED,
  payload: tokenError,
});
/**
 * It returns an object with a type of DATAREJECTED and a payload of dataError
 * @param dataError - The error message that will be displayed to the user.
 */
const userDataRejected = (dataError) => ({
  type: DATAREJECTED,
  payload: dataError,
});
/**
 * It returns an object with a type property set to LOGOUT
 */
const userLogout = () => ({ type: LOGOUT });
/**
 * It returns an object with a type property set to REMEMBER
 */
const userRememberMe = () => ({
  type: REMEMBER,
});
/**
 * It returns an object with a type property and a payload property
 * @param firstName - The first name of the user.
 * @param lastName - The last name of the user.
 */
const userEditProfile = (firstName, lastName) => ({
  type: EDITPROFILE,
  payload: { firstName, lastName },
});

/**
 * It fetches a token from the server, and if successful, it dispatches an action to update the token
 * in the Redux store
 * @param {{ getState: () => any; dispatch: (arg0: { type: string; payload?: any; }) => void; }} store - the redux store
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
 * @param {{ getState: () => any; dispatch: (arg0: { type: string; payload?: any; }) => void; }} store - the redux store
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
 * @param {{ getState: () => any; dispatch: (arg0: { type: string; payload?: any; }) => void; }} store - the redux store
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
 * @param {{ dispatch: (arg0: { type: string; }) => void; }} store - The Redux store
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

/**
 * It will receive all the data use for the user
 * @function :  dataReducer
 * @param {object} state:contain initial and final state of data
 * @param {object} action:return the action object
 */
export default function userReducer(state = initialState, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case TOKENFETCHING: {
        if (draft.tokenStatus === "void") {
          draft.tokenStatus = "pending";
          return;
        }
        if (draft.tokenStatus === "rejected") {
          draft.tokenStatus = "pending";
          draft.tokenError = null;
          return;
        }
        if (draft.tokenStatus === "resolved") {
          draft.tokenStatus = "updating";
          return;
        }
        return;
      }
      case TOKENRESOLVED: {
        if (
          draft.tokenStatus === "pending" ||
          draft.tokenStatus === "updating"
        ) {
          draft.tokenStatus = "resolved";
          draft.token = action.payload;
          return;
        }
        return;
      }
      case TOKENREJECTED: {
        if (
          draft.tokenStatus === "pending" ||
          draft.tokenStatus === "updating"
        ) {
          draft.tokenStatus = "rejected";
          draft.tokenError = action.payload;
          draft.token = null;
          return;
        }
        return;
      }
      case DATAFETCHING: {
        if (draft.dataStatus === "void") {
          draft.dataStatus = "pending";
          return;
        }
        if (draft.dataStatus === "rejected") {
          draft.dataStatus = "pending";
          draft.dataError = null;
          return;
        }
        if (draft.dataStatus === "resolved") {
          draft.dataStatus = "updating";
          return;
        }
        return;
      }
      case DATARESOLVED: {
        if (draft.dataStatus === "pending" || draft.dataStatus === "updating") {
          draft.dataStatus = "resolved";
          draft.data = action.payload;
          return;
        }
        return;
      }
      case DATAREJECTED: {
        if (draft.dataStatus === "pending" || draft.dataStatus === "updating") {
          draft.dataStatus = "rejected";
          draft.dataError = action.payload;
          draft.data = null;
          return;
        }
        return;
      }
      case LOGOUT: {
        draft.tokenStatus = "void";
        draft.dataStatus = "void";
        draft.token = null;
        draft.data = null;
        draft.tokenError = null;
        draft.dataError = null;
        draft.rememberMe = false;
        return;
      }
      case REMEMBER: {
        if (draft.token) {
          draft.rememberMe = true;
          return;
        }
        draft.rememberMe = !draft.rememberMe;
        return;
      }
      case EDITPROFILE: {
        draft.data.firstName = action.payload.firstName;
        draft.data.lastName = action.payload.lastName;
        return;
      }
      default:
        return;
    }
  });
}
