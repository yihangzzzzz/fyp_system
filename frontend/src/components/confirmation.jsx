// src/components/Modal.jsx
import React from 'react';
import NewItemForm from './newItemForm';
import NewPOForm from './newPOForm';

const Confirmation = ({isOpen, onClose, onSubmit}) => {
  if (!isOpen) return null;

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

    const handleSubmit = (newRecord) => {
      onSubmit(newRecord);
    }


  return (
    <div className="modal-overlay">
      <div className="modal-content">
      <h2 className='form-title'>Confirm to Submit?</h2>
        <div className='submission-buttons'>
          <button className="submit-button" onClick={onSubmit} type="submit">Submit</button>
          <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
