// src/components/Modal.jsx
import React from 'react';

const NewItemForm = ({ onFormSubmit }) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newItem = {
      name: formData.get('name'),
      category: formData.get('category'),
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
            Category:⠀
            <input type="text" name="category" required />
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
