// src/components/StatusDropdown.js
import React, { useEffect, useState } from 'react';
import { MdOutlineAddBox, MdModeEditOutline, MdDelete} from 'react-icons/md';
import axios from 'axios';
import Confirmation from './confirmation';
import { useNavigate } from 'react-router-dom';

const Actions = ({toDelete, toEdit}) => {
  const navigate = useNavigate();
  const [deleteItemName, setDeleteItemName] = useState(toDelete);
  const [editItemName, setEditItemName] = useState(toEdit);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleDelete = () => {
      
      axios
        .delete(`http://localhost:3000/inventory/${encodeURIComponent(deleteItemName)}`)
        .catch((error) => {
          console.log("Error deleting item: " + error);
        });
        navigate(`/inventory`)
  }

  const handleEdit = () => {
    navigate(`/inventory/edititem/${encodeURIComponent(editItemName)}`)
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
      <MdModeEditOutline 
        title='Edit'
        onClick={handleEdit}/>
      <MdDelete onClick={() => setIsConfirmationOpen(true)} title='Delete' />
      <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleDelete}/>
    </div>

  );
}

export default Actions;
