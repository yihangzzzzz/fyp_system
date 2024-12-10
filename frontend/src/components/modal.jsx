// const React = require('react');

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// const Modal = ({onSubmit, onClose, formData, setFormData, FormComponent, deliveredItems}) => {
const Modal = ({ isOpen, onSubmit, onCancel, editUsername }) => {
  const location = useLocation();
  const db = new URLSearchParams(location.search).get("db");

  const [newUser, setNewUser] = useState({});

  if (!isOpen) return null;

  const handleSetNewUser = (field, value) => {
    setNewUser((prevState) => ({
      ...prevState,
      [field]: value, // Replace with the new value for destination
    }));
    console.log("user is", newUser);
  };

  const handleSubmit = (user) => {
    onSubmit(user);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="form-title">
          {editUsername ? "Change Password" : "Add New User"}
        </h2>
        <div className="inputs">
          <div className="input-field">
            <h5>Username</h5>
            <input
              type="text"
              name="username"
              // value = {editUsername ? editUsername : ''}
              disabled={editUsername ? true : false}
              placeholder={editUsername ? editUsername : ""}
              onChange={(e) => handleSetNewUser(e.target.name, e.target.value)}
              style={{ outline: "2px solid black" }}
            />
          </div>
          <div className="input-field">
            <h5>Password</h5>
            <input
              type="text"
              name="password"
              // value={filterQuery.itemName || ''}
              onChange={(e) => handleSetNewUser(e.target.name, e.target.value)}
              style={{ outline: "2px solid black" }}
            />
          </div>
        </div>
        <div className="submission-buttons">
          <button
            className="user-submit-button"
            onClick={() => handleSubmit(newUser)}
            type="submit"
          >
            Submit
          </button>
          <button className="user-cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// module.exports = Modal;
export default Modal;
