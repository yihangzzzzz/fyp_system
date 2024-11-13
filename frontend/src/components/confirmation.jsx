// src/components/Modal.jsx
// const NewItemForm = require('./NewDeliveryForm');
// const NewPOForm = require('./newPOForm');
// const NewDeliveryForm = require('./NewDeliveryForm'); // Removed the duplicate import

// const React = require('react');
// const { useRef } = React;

import React, { useRef } from 'react';


const Confirmation = ({isOpen, onClose, onSubmit, message}) => {
  if (!isOpen) return null;

  const newFormRef = useRef(null);
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.target);
  //   const newItem = {
  //     name: formData.get('name'),
  //     category: formData.get('category'),
  //     quantity: formData.get('quantity'),
  //   };
  //   onSubmit(newItem);
  // };


  return (
    <div className="modal-overlay">
      <div className="modal-content">
      <h2 className='form-title'>{message}</h2>
          <div className='submission-buttons'>
            <button className="confirmation-submit-button" onClick={onSubmit} type="submit">Submit</button>
            <button className="cancel-button" onClick={onClose}>Cancel</button>
          </div>
      </div>
    </div>
  );
};

// module.exports = Confirmation;
export default Confirmation;
