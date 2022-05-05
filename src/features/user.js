import produce from "immer";

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
export const userTokenFetching = () => ({ type: TOKENFETCHING });
/**
 * It returns an object with a type of DATAFETCHING
 */
export const userDataFetching = () => ({ type: DATAFETCHING });
/**
 * It returns an object with a type of TOKENRESOLVED and a payload of token
 * @param token - The token that is being passed to the reducer.
 */
export const userTokenResolved = (token) => ({
  type: TOKENRESOLVED,
  payload: token,
});
/**
 * It returns an object with a type of DATARESOLVED and a payload of data
 * @param data - The data that is being passed to the reducer.
 */
export const userDataResolved = (data) => ({
  type: DATARESOLVED,
  payload: data,
});
/**
 * It returns an object with a type of TOKENREJECTED and a payload of tokenError
 * @param tokenError - The error message that will be displayed to the user.
 */
export const userTokenRejected = (tokenError) => ({
  type: TOKENREJECTED,
  payload: tokenError,
});
/**
 * It returns an object with a type of DATAREJECTED and a payload of dataError
 * @param dataError - The error message that will be displayed to the user.
 */
export const userDataRejected = (dataError) => ({
  type: DATAREJECTED,
  payload: dataError,
});
/**
 * It returns an object with a type property set to LOGOUT
 */
export const userLogout = () => ({ type: LOGOUT });
/**
 * It returns an object with a type property set to REMEMBER
 */
export const userRememberMe = () => ({
  type: REMEMBER,
});
/**
 * It returns an object with a type property and a payload property
 * @param firstName - The first name of the user.
 * @param lastName - The last name of the user.
 */
export const userEditProfile = (firstName, lastName) => ({
  type: EDITPROFILE,
  payload: { firstName, lastName },
});

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
