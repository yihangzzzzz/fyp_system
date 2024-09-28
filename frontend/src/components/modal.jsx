// const React = require('react');

import React, { useEffect, useState } from 'react';



// const Modal = ({onSubmit, onClose, formData, setFormData, FormComponent, deliveredItems}) => {
const Modal = ({isOpen, onSubmit, onCancel}) => {

  const[newUser, setNewUser] = useState({})
  
  if (!isOpen) return null;

  const handleSetNewUser = (field, value) => {
    setNewUser(prevState => ({
      ...prevState,
      [field]: value  // Replace with the new value for destination
    }));
  }

  const handleSubmit = (user) => {
    onSubmit(user)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className='form-title'>Add New User</h2>
        <div className='inputs'>
          <div className="input-field">
            <h5>Username</h5>
            <input
              type="text"
              name='username'
              // value={filterQuery.itemName || ''}
              onChange={(e) => handleSetNewUser(e.target.name, e.target.value)}
              style={{ outline: '2px solid black' }}
            />
          </div>
          <div className="input-field">
            <h5>Password</h5>
            <input
              type="text"
              name='password'
              // value={filterQuery.itemName || ''}
              onChange={(e) => handleSetNewUser(e.target.name, e.target.value)}
              style={{ outline: '2px solid black' }}
            />
          </div>
        </div>
        <div className='submission-buttons'>
              <button className="submit-button" onClick={() => handleSubmit(newUser)} type="submit">Submit</button>
              <button className="cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// module.exports = Modal;
export default Modal;