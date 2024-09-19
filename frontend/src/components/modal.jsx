const React = require('react');
const NewDeliveryForm = require('./NewDeliveryForm');


const Modal = ({ onSubmit, onClose, formData, setFormData, FormComponent, deliveredItems}) => {

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className='form-title'>Confirm to Submit?</h2>
        <FormComponent formData={formData} setFormData={setFormData} deliveredItems={deliveredItems} />
        <div className='submission-buttons'>
              <button className="submit-button" onClick={onSubmit} type="submit">Submit</button>
              <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

module.exports = Modal;