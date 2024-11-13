// const React = require('react');
// const { useState, useEffect } = React;
// const { useNavigate } = require('react-router-dom');
// const Navbar = require('../components/navbar');
// const axios = require('axios');
// // const { Buffer } = require('buffer'); // Uncomment if needed
// const Confirmation = require('../components/confirmation');

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import axios from 'axios';
// import { Buffer } from 'buffer'; // Uncomment if needed
import Confirmation from '../components/confirmation.jsx';
import { ResizeImage } from '../functions/resizeImage.jsx';
import { useLocation } from 'react-router-dom';


const NewItem = ({}) => {
  const location = useLocation();
  const db = new URLSearchParams(location.search).get('db');

    const [picture, setPicture] = useState();  
    const [loading, setLoading] = useState(false);
    const [newItem, setNewItem] = useState({picture: '', name: '', serial: null, quantity: null, description: ''});
    const navigate = useNavigate(); 
    const [items, setItems] = useState([]);
    // const [selectedItem, setSelectedItem] = useState('');
    const [orderItems, setOrderItems] = useState([]);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const x = '';
    const formData = new FormData();
  
    useEffect(() => {
    }, []);
  

    const handleAddItem = () => {
      
      formData.append('picture', newItem.picture);
      formData.append('name', newItem.name);
      // formData.append('serial', newItem.serial);
      formData.append('quantity', newItem.quantity);
      formData.append('description', newItem.description);

      axios
      // .post("http://www.iistesting.com:3000/inventory", newItem, {
      // })
      .post(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/inventory_be/newitem?db=${db}`, formData, {
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

      navigate(`/inventory?db=${db}`);
      window.location.reload();
    };

    const handleNewItemChange = (e, info) => {
      setNewItem(prevState => ({
        ...prevState,
        [info]: e  // Replace with the new value for destination
      }));
    }

  //   const handleImageChange = (e) => {
  //     console.log("original file is",e);
  //     Resizer.imageFileResizer(
  //       e,
  //       100, // new width
  //       100, // new height
  //       'JPEG', // output format
  //       100, // quality (1-100)
  //       0, // rotation (0, 90, 180, 270)
  //       (uri) => {
  //           // This is where you get the resized image as a Data URL
  //           // setResizedImage(uri);
  //           fetch(uri)
  //           .then(res => res.blob())
  //           .then(blob => {
  //             const file = new File([blob], e.name, { type: blob.type });
  //             setNewItem(prevState => ({
  //               ...prevState,
  //               picture: file  // Replace with the new value for destination
  //             }));
  //             console.log("resized file is", file);
  //       });

  //   });
  // };
  
  const handleImageChange = (e) => {
    setNewItem(prevState => ({
      ...prevState,
      picture: e  // Replace with the new value for destination
    }));

  
    const file = e; // The file is the image file from input
    // Create a FileReader to read the file
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set the canvas size to 100x100
            canvas.width = 100;
            canvas.height = 100;

            // Draw the image onto the canvas with forced dimensions (no aspect ratio preservation)
            ctx.drawImage(img, 0, 0, 100, 100);

            // Convert canvas to a Blob (file-like object)
            canvas.toBlob((blob) => {
              const resizedFile = new File([blob], file.name, { type: blob.type });
              setNewItem(prevState => ({
                ...prevState,
                picture: resizedFile  // Replace with the new value for destination
              }));

                // You can now use `resizedFile` to upload via Axios or any other metho


            }, file.type, 1); // Set quality to 1 (100%)
        };
    };
    // Read the image file as Data URL
    reader.readAsDataURL(file);
};

    return (
      <div>
        <Navbar />
        <div className='topbar'>
          <h1 className="title">Add New Item</h1>
        </div>
        <div className='order_table'>
        <form onSubmit={(e) => {e.preventDefault(); setIsConfirmationOpen(true)}}>
        <div className='transfer_info_main'>
          <div className='transfer_info'>

            
              <div className='transfer-info-input'>
                  <label htmlFor='image'>Upload Image</label>
                  <input
                      type='file'
                      id='image'
                      accept='image/*'
                      // value={newItem.picture}
                      onChange={(e) => handleImageChange(e.target.files[0])}
                  />
              </div>
              <div className='transfer-info-input'>
                      <label>Item Name</label>
                        <input
                          type="text"
                          value={newItem.name}
                          onChange={(e) => handleNewItemChange(e.target.value, 'name')}
                          required
                        />
              </div>
              <div className='transfer-info-input'>
                      <label>Quantity</label>
                        <input
                          type="number"
                          value={newItem.quantity}
                          onChange={(e) => handleNewItemChange(e.target.value, 'quantity')}
                          required
                        />
              </div>
              <div className='transfer-info-input'>
                <label>Description</label>
                <textarea
                  type="description"
                  value={newItem.description}
                  onChange={(e) => handleNewItemChange(e.target.value, 'description')}
                />
              </div>
            

          </div>
        </div>

        <button className="submit-button" type="submit">Submit</button>
        </form>
        
        </div>
        <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleAddItem}
        message={"Confirm to Add New Item?"}/>
      </div>
    );
  }
  
// module.exports = NewItem;
export default NewItem;