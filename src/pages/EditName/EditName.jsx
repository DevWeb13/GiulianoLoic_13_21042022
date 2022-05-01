import React, { useState } from "react";
import { useSelector, useStore } from "react-redux";
import { selectUser } from "../../utils/selectors";
import { editProfile } from "../../features/user";
import { useNavigate } from "react-router-dom";

function EditName() {
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");

  const store = useStore();

  const user = useSelector(selectUser);

  const navigate = useNavigate();

  function cancel() {
    navigate("/profile");
  }

  async function editNameSubmit(e) {
    e.preventDefault();
    const token = user.token;
    editProfile(store, newFirstName, newLastName, token);
    navigate("/profile");
  }

  return (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Edit name</h1>
        <form onSubmit={(e) => editNameSubmit(e)}>
          <div className="input-wrapper">
            <label htmlFor="newFirstName">New firstname: </label>
            <input
              type="text"
              id="newFirstName"
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="newLastName">New lastname: </label>
            <input
              type="text"
              id="newLastName"
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
            />
          </div>
          <button type="submit" className="sign-in-button">
            Edit name
          </button>
          <button
            type="button"
            className="sign-in-button cancel-button"
            onClick={() => cancel()}
          >
            Cancel
          </button>
        </form>
      </section>
    </main>
  );
}

export default EditName;
