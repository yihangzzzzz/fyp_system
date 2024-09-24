import React, { useRef, useState } from 'react';

const FilterModal = ({onSubmit, onClose}) => {

    const [filters, setFilters] = useState({});

    const handleSetFilter = (e, filter) => {
        setFilters(prevState => ({
            ...prevState,
            [filter]: e  // Replace with the new value for destination
          }));
    }

    return (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* <h2 className='form-title'>Confirm to Submit?</h2> */}
            {/* <FormComponent formData={formData} setFormData={setFormData} deliveredItems={deliveredItems} /> */}
            <h2 className='form-title'>Filters</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <h5>Item Name</h5>
                  <input
                    type="text"
                    onChange={(e) => handleSetFilter(e.target.value, 'itemName')}
                    style={{ outline: '2px solid black' }}
                  />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <h5>PO Date</h5>
                  <input
                    type="date"
                    onChange={(e) => handleSetFilter(e.target.value, 'poDate')}
                    style={{ outline: '2px solid black' }}
                  />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <h5>PO Number</h5>
                  <input
                    type="text"
                    onChange={(e) => handleSetFilter(e.target.value, 'poNumber')}
                    style={{ outline: '2px solid black' }}
                  />
        </div>
            <div className='submission-buttons'>
                  <button className="submit-button" onClick={onSubmit(filters)} type="submit">Submit</button>
                  <button className="cancel-button" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      );
}

export default FilterModal