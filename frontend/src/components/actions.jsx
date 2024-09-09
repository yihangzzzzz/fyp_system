// src/components/StatusDropdown.js
const React = require('react');
const { useState } = React;
const { MdOutlineAddBox, MdModeEditOutline, MdDelete } = require('react-icons/md');
const axios = require('axios');
const Confirmation = require('./confirmation');
const { useNavigate } = require('react-router-dom');

const Actions = ({toDelete, toEdit}) => {
  const navigate = useNavigate();
  const [deleteItemName, setDeleteItemName] = useState(toDelete);
  const [editItemName, setEditItemName] = useState(toEdit);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleDelete = () => {
      
      axios
        .delete(`http://www.iistesting.com:3000/inventory/${encodeURIComponent(deleteItemName)}`)
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

module.exports = Actions;
