// src/components/Modal.jsx
import React, { useRef } from 'react';
import NewItemForm from './NewDeliveryForm';
import NewPOForm from './newPOForm';
import NewDeliveryForm from './NewDeliveryForm';


const Confirmation = ({isOpen, onClose, onSubmit, FormComponent}) => {
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
