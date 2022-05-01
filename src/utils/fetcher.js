// import { fetchToken } from "../features/user";
// import { createSlice } from "@reduxjs/toolkit";

// export function requestForToken(email, password) {
//   return async (dispatch, getState) => {
//     console.log("hello");
//     const { user } = getState();
//     const { token } = user;
//     // if (token) {
//     //   return token;
//     // }
//     const options = {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//     };
//     try {
//       const response = await fetch(
//         "http://localhost:3001/api/v1/user/login",
//         options
//       );
//       const res = await response.json();

//       if (res.status !== 200) {
//         // setIsError(true);
//       } else {
//         // setIsError(false);
//         dispatch(fetchToken(res.body.token));
//         // requestForProfile(res.body.token);

//         // remenberMe();
//         // navigate("/user");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
// }
