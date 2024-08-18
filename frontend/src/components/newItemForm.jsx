// src/components/Modal.jsx
import React from 'react';

const NewItemForm = ({ onFormSubmit }) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newItem = {
      name: formData.get('name'),
      serial: formData.get('serial'),
      quantity: formData.get('quantity'),
    };
    onFormSubmit(newItem);
  };

  return (
    <div>
        <form onSubmit={handleSubmit}>
          <label>
            Name:⠀
            <input type="text" name="name" required />
          </label>
          <label>
            Serial Number:⠀
            <input type="text" name="serial" required />
          </label>
          <label>
            Quantity:⠀
            <input type="number" name="quantity" required />
          </label>
          <button className="submit-button" type="submit">Submit</button>
        </form>
    </div>
  );
};

export default NewItemForm;
