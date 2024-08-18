// src/components/StatusDropdown.js
import React, { useEffect, useState } from 'react';
import { MdOutlineAddBox, MdModeEditOutline, MdDelete} from 'react-icons/md';
import axios from 'axios';

const Confirmation = ({toDelete}) => {
  const [deleteItemName, setDeleteItemName] = useState(toDelete);

  const handleDelete = () => {
      axios
        .delete(`http://localhost:3000/inventory/'${encodeURIComponent(deleteItemName)}'`)
        .catch((error) => {
          console.log("Error deleting item: " + error);
        });
  }

  return (
    // <select
    //   value={status}
    //   onChange={handleChange}
    //   onBlur={handleBlur}
    //   autoFocus
    //   style={{ marginLeft: '8px' }}
    // >
    //   <option value="Pending">Pending</option>
    //   <option value="Fulfilled">Fulfilled</option>
    //   <option value="Cancelled">Cancelled</option>
    //   {/* Add more options as needed */}
    // </select>
    <div className='inventory_actions'>
      <MdOutlineAddBox title='Add'/>
      <MdModeEditOutline title='Edit'/>
      <MdDelete onClick={handleDelete} title='Delete' />
    </div>

  );
}

export default Confirmation;
