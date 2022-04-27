import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectLogin, userLogout } from "../../features/login";
import { apiResponseLogout } from "../../features/apiResponse";
import { profileLogout, selectProfile } from "../../features/profile";

function Header() {
  const profile = useSelector(selectProfile);

  const dispatch = useDispatch();

  function signOut() {
    localStorage.removeItem("token");
    dispatch(userLogout());
    dispatch(apiResponseLogout());
    dispatch(profileLogout());
  }

  return (
    <nav className="main-nav">
      <Link className="main-nav-logo" to="/">
        <img
          className="main-nav-logo-image"
          src="/img/argentBankLogo.png"
          alt="Argent Bank Logo"
        />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>
      {profile ? (
        <div>
          <Link className="main-nav-item" to="/user">
            <i className="fa fa-user-circle"></i>
            {`${profile.body.firstName}`}
          </Link>
          <Link className="main-nav-item" to="/" onClick={() => signOut()}>
            <i className="fa fa-sign-out"></i>
            Sign Out
          </Link>
        </div>
      ) : (
        <div>
          <Link className="main-nav-item" to="/login">
            <i className="fa fa-user-circle"></i>
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Header;
