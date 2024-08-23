import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import React from 'react'
import Navbar from '../components/navbar'
import axios from 'axios'
import Confirmation from '../components/confirmation'

const NewItem = ({}) => {

    const [newItem, setNewItem] = useState({picture: null, name: '', serial: null, quantity: null});
    const navigate = useNavigate(); 
    const [items, setItems] = useState([]);
    // const [selectedItem, setSelectedItem] = useState('');
    const [orderItems, setOrderItems] = useState([]);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const x = '';
  
    useEffect(() => {
    }, []);
  
    const handleAddItem = () => {
      axios
      .post("http://localhost:3000/inventory", newItem, {
        headers: {
            'Content-Type': 'multipart/form-data'
          }
      })
      .then(() => {
          setLoading(false);
          
      })
      .catch((error) => {
        console.log("Error adding item: " + error);
        setLoading(false);
      });
    };

    const handleNewItemChange = (e, info) => {
      setNewItem(prevState => ({
        ...prevState,
        [info]: e  // Replace with the new value for destination
      }));
    }

    const handleImageChange = (e) => {
      setNewItem(prevState => ({
        ...prevState,
        picture: e  // Replace with the new value for destination
      }));
    };
  


    return (
      <div>
        <Navbar />
        <div className='topbar'>
          <h1 className="title">Add New Item</h1>
        </div>
        <div className='order_table'>
        <div className='transfer_info'>
        <div>
            <h5 htmlFor='image'>Upload Image</h5>
            <input
                type='file'
                id='image'
                accept='image/*'
                value={newItem.picture}
                onChange={(e) => handleImageChange(e.target.files[0])}
            />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h5>Item Name</h5>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => handleNewItemChange(e.target.value, 'name')}
                    style={{ outline: '2px solid black' }}
                  />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h5>Serial Number</h5>
                  <input
                    type="number"
                    value={newItem.serial}
                    onChange={(e) => handleNewItemChange(e.target.value, 'serial')}
                    style={{ outline: '2px solid black' }}
                  />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h5>Quantity</h5>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => handleNewItemChange(e.target.value, 'quantity')}
                    style={{ outline: '2px solid black' }}
                  />
        </div>
        <button className="submit-button" type="submit" onClick={handleAddItem}>Submit</button>
        </div>
        </div>
      </div>
    );
  }
  
  export default NewItem;