// src/components/Modal.jsx
import React from 'react';

const NewPOForm = ({ onFormSubmit }) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPO = {
      date: formData.get('date'),
      number: formData.get('number'),
      name: formData.get('name'),
      quantity: formData.get('quantity')
    };
    onFormSubmit(newPO);
  };

  return (
    <div>
        <form onSubmit={handleSubmit}>
        <label>
            Date:⠀
            <input type="date" name="date" required />
          </label>
          <label>
            PO Number:⠀
            <input type="text" name="number" required />
          </label>
          <label>
            Item Name:⠀
            <input type="text" name="name" required />
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

export default NewPOForm;
