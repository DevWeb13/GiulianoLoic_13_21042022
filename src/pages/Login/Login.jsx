import React, { useEffect, useState } from "react";
import { useSelector, useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchOrUpdateToken,
  fetchOrUpdateData,
  rememberMe,
} from "../../utils/dataManager";
import { selectUser } from "../../utils/selectors";

/**
 * It renders a form with two inputs, a checkbox and a button
 * @returns A function that returns a component
 */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const store = useStore();

  const user = useSelector(selectUser);

  const navigate = useNavigate();

  useEffect(() => {
    if (user.token) {
      navigate("/profile");
    }
  }, [navigate, user.token]);

  const handleCheckbox = () => {
    rememberMe(store);
  };

  /**
   * A function that is called when the user clicks the login button. It prevents the default action of
   * the button, which is to submit the form. It then calls the fetchOrUpdateToken function, which will
   * either fetch a new token or update the existing token. It then calls the fetchOrUpdateData
   * function, which will either fetch new data or update the existing data.
   */
  async function loginSubmit(e) {
    e.preventDefault();
    const token = await fetchOrUpdateToken(store, email, password);
    fetchOrUpdateData(store, token);
  }

  return (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form onSubmit={(e) => loginSubmit(e)}>
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
            <input
              {...{ user }}
              onChange={handleCheckbox}
              type="checkbox"
              id="remember-me"
            />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          {user.tokenError && <div className="errorInfo">Invalid data</div>}
          <button type="submit" className="sign-in-button">
            Sign In
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
