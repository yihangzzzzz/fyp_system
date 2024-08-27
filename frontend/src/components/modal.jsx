import React from 'react';
import NewDeliveryForm from './NewDeliveryForm';

const Modal = ({ onSubmit, onClose, formData, setFormData, FormComponent}) => {

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className='form-title'>Confirm to Submit?</h2>
        <FormComponent formData={formData} setFormData={setFormData} />
        <div className='submission-buttons'>
              <button className="submit-button" onClick={onSubmit} type="submit">Submit</button>
              <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;