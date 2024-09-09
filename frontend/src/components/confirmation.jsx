// src/components/Modal.jsx
const React = require('react');
const { useRef } = React;
const NewItemForm = require('./NewDeliveryForm');
const NewPOForm = require('./newPOForm');
const NewDeliveryForm = require('./NewDeliveryForm'); // Removed the duplicate import

// You can now use the imported components in your code



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

module.exports = Confirmation;
