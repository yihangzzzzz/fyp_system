// src/components/StatusDropdown.js
import React, { useState } from 'react';

const StatusDropdown = ({ currentStatus, onStatusChange, onClose }) => {
  const [status, setStatus] = useState(currentStatus);

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const handleBlur = () => {
    onStatusChange(status);
    onClose(); // Close the dropdown when the status is changed
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      onBlur={handleBlur}
      autoFocus
      style={{ marginLeft: '8px' }}
    >
      <option value="Pending">Pending</option>
      <option value="Fulfilled">Fulfilled</option>
      <option value="Cancelled">Cancelled</option>
      {/* Add more options as needed */}
    </select>
  );
};

export default StatusDropdown;
