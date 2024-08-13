// src/components/Modal.jsx
import React from 'react';
import NewItemForm from './newItemForm';
import NewPOForm from './newPOForm';

const Modal = ({ isOpen, onClose, onSubmit, FormComponent }) => {
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
        <button className="close-button" onClick={onClose}>X</button>
        {FormComponent == NewItemForm ? (
          <h2 className='form-title'>Add New Item</h2>
        ) : FormComponent == NewPOForm ? (
          <h2 className='form-title'>Add New PO</h2>
        ) : (
          <h2 className='form-title'>Add New Order</h2>
        )
        }
        {/* <form onSubmit={handleSubmit}>
          <label>
            Name: 
            <input type="text" name="name" required />
          </label>
          <label>
            Category: 
            <input type="text" name="category" required />
          </label>
          <label>
            Quantity: 
            <input type="number" name="quantity" required />
          </label>
          <button className="submit-button" type="submit">Submit</button>
        </form> */}
        <FormComponent onFormSubmit={handleSubmit}/>
      </div>
    </div>
  );
};

export default Modal;
