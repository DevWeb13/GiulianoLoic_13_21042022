import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { userLogin } from "../../features/login";
import { apiResponseLogin } from "../../features/apiResponse";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  async function requestForLogin() {
    const requestHeaders = {
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
        requestHeaders
      );
      const res = await response.json();
      if (res.status !== 200) {
        dispatch(apiResponseLogin(res));
      } else {
        dispatch(apiResponseLogin(res));
        dispatch(userLogin({ email, password }));
        localStorage.setItem("token", res.token);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    requestForLogin();
  }

  return (
    <div>
      <main className="main bg-dark">
        <section className="sign-in-content">
          <i className="fa fa-user-circle sign-in-icon"></i>
          <h1>Sign In</h1>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="input-wrapper">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-remember">
              <input type="checkbox" id="remember-me" />
              <label htmlFor="remember-me">Remember me</label>
            </div>

            <button type="submit" className="sign-in-button">
              Sign In
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default SignIn;
