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
      pdf: e.target.files[0],
    }));
  };

  return (
    <form style={{ display: 'flex', alignItems: 'left', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <h5>PO Number</h5>
          <input
          type="text"
          name="po"
          placeholder="Enter PO number"
          value={formData.po || ''}
          onChange={handleInputChange}
          style={{ outline: '2px solid black' }}
          />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <h5>Delivery Date</h5>
          <input
          type="date"
          name="date"
          placeholder="Enter delivery date"
          value={formData.date || ''}
          onChange={handleInputChange}
          style={{ outline: '2px solid black' }}
          />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
        <h5>Upload PDF</h5>
        <input
          type="file"
          name="pdf"
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