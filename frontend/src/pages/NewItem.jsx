import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import React from 'react'
import Navbar from '../components/navbar'
import axios from 'axios'
// import { Buffer } from "buffer";
import Confirmation from '../components/confirmation'

const NewItem = ({}) => {

    const [picture, setPicture] = useState();  
    const [loading, setLoading] = useState(false);
    const [newItem, setNewItem] = useState({picture: '', name: '', serial: null, quantity: null});
    const navigate = useNavigate(); 
    const [items, setItems] = useState([]);
    // const [selectedItem, setSelectedItem] = useState('');
    const [orderItems, setOrderItems] = useState([]);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const x = '';
  
    useEffect(() => {
    }, []);
  

    const handleAddItem = () => {
      const formData = new FormData();
      formData.append('picture', newItem.picture);
      formData.append('name', newItem.name);
      formData.append('serial', newItem.serial);
      formData.append('quantity', newItem.quantity);
      console.log("picture data is ",newItem.picture);

      axios
      // .post("http://localhost:3000/inventory", newItem, {
      // })
      .post("http://localhost:3000/inventory/newitem", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(() => {
          setLoading(false);
          
      })
      .catch((error) => {
        console.log("Error adding item: " + error);
        setLoading(false);
      });

      navigate('/inventory');
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
      console.log(e);
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
                // value={newItem.picture}
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
        <button className="submit-button" type="submit" onClick={() => setIsConfirmationOpen(true)}>Submit</button>
        </div>
        </div>
        <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleAddItem}/>
      </div>
    );
  }
  
  export default NewItem;