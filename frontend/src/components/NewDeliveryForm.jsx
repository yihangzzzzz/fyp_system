import React from 'react';

const NewDeliveryForm = ({ formData, setFormData }) => {

  formData.date = new Date().toISOString().split('T')[0];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePDFInputChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      doDocument: e.target.files[0],
    }));
  };

  return (
    <form style={{ display: 'flex', alignItems: 'left', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <h5>DO Number</h5>
          <input
          type="text"
          name="doNumber"
          placeholder="Enter DO number"
          // value={formData.doNumber || ''}
          onChange={handleInputChange}
          style={{ outline: '2px solid black' }}
          />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <h5>DO Date</h5>
          <input
          type="date"
          name="doDate"
          placeholder="Enter DO date"
          // value={formData.doDate || ''}
          onChange={handleInputChange}
          style={{ outline: '2px solid black' }}
          />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
        <h5>Upload DO Documnet</h5>
        <input
          type="file"
          name="doDocument"
          accept=".pdf"
          onChange={handlePDFInputChange}
          style={{ outline: '2px solid black' }}
        />
      </div>

      {/* Add more inputs as needed */}
    </form>
  );
};

export default NewDeliveryForm;