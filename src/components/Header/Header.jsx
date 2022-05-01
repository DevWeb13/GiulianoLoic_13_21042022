import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useStore } from "react-redux";
import {
  signOut,
  checkStorageToken,
  fetchOrUpdateData,
} from "../../features/user";
import { selectUser } from "../../utils/selectors";

function Header() {
  const store = useStore();

  const user = useSelector(selectUser);

  useEffect(() => {
    async function checkIfToken() {
      const token = await checkStorageToken(store);
      fetchOrUpdateData(store, token);
    }
    checkIfToken();
  }, [store]);

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
      {user.data ? (
        <div>
          <Link className="main-nav-item" to="/user">
            <i className="fa fa-user-circle"></i>
            {`${user.data.firstName}`}
          </Link>
          <Link className="main-nav-item" to="/" onClick={() => signOut(store)}>
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
