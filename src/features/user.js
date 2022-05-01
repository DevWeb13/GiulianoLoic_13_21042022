import produce from "immer";
import { selectUser } from "../utils/selectors";

const initialState = {
  tokenStatus: "void",
  dataStatus: "void",
  token: null,
  data: null,
  tokenError: null,
  dataError: null,
  rememberMe: false,
};

const TOKENFETCHING = "user/tokenFetching";
const DATAFETCHING = "user/dataFetching";
const TOKENRESOLVED = "user/tokenResolved";
const DATARESOLVED = "user/dataResolved";
const TOKENREJECTED = "user/tokenRejected";
const DATAREJECTED = "user/dataRejected";
const LOGOUT = "user/logout";
const REMEMBER = "user/rememberMe";

const userTokenFetching = () => ({ type: TOKENFETCHING });
const userDataFetching = () => ({ type: DATAFETCHING });
const userTokenResolved = (token) => ({ type: TOKENRESOLVED, payload: token });
const userDataResolved = (data) => ({ type: DATARESOLVED, payload: data });
const userTokenRejected = (tokenError) => ({
  type: TOKENREJECTED,
  payload: tokenError,
});
const userDataRejected = (dataError) => ({
  type: DATAREJECTED,
  payload: dataError,
});
const userLogout = () => ({ type: LOGOUT });
const userRememberMe = (rememberMe) => ({
  type: REMEMBER,
  payload: rememberMe,
});

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
    store.dispatch(userDataResolved(res.body));
  } catch (error) {
    store.dispatch(userDataRejected(error));
  }
}

export async function checkStorageToken(store) {
  const token =
    (await localStorage.getItem("token")) || sessionStorage.getItem("token");
  if (token) {
    store.dispatch(userTokenFetching());
    store.dispatch(userTokenResolved(token));
    return token;
  }
  return null;
}

export function signOut(store) {
  store.dispatch(userLogout());

  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
}

export function rememberMe(store) {
  store.dispatch(userRememberMe());
}

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
      case DATARESOLVED: {
        if (draft.dataStatus === "pending" || draft.dataStatus === "updating") {
          if (
            draft.dataStatus === "pending" ||
            draft.dataStatus === "updating"
          ) {
            draft.dataStatus = "resolved";
            draft.data = action.payload;
            return;
          }
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
        draft.rememberMe = !draft.rememberMe;
        return;
      }

      default:
        return;
    }
  });
}
