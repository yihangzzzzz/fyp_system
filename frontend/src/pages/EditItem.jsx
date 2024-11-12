// const React = require('react');
// const { useEffect, useState } = React;
// const { useParams, useNavigate } = require('react-router-dom');
// const axios = require('axios');
// const Navbar = require('../components/navbar');
// const Confirmation = require('../components/confirmation');

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/navbar.jsx';
import Confirmation from '../components/confirmation.jsx';
import { useLocation } from 'react-router-dom';


const EditItem = () => {
    const location = useLocation();
    const db = new URLSearchParams(location.search).get('db');


    const navigate = useNavigate();
    const { itemID } = useParams();
    const [item, setItem] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    useEffect(() => {
        fetchItem();
    }, []);

    const fetchItem = async () => {
        setLoading(true);
        await axios
        .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/inventory_be/${encodeURIComponent(itemID)}?db=${db}`)
        .then((res) => {
            setItem(res.data.recordset[0]);
            setLoading(false);
        })
        .catch((error) => {
            console.log("le error is " + error);
            setLoading(false);
        });
    }
    const handleItemChange = (e, info) => {
        setItem(prevState => ({
            ...prevState,
            [info]: e  // Replace with the new value for destination
        }));
      }
      
      const handleImageChange = (e) => {
        setItem(prevState => ({
            ...prevState,
            picture: e  // Replace with the new value for destination
        }));
      }

    const handleSaveItemChanges = async () => {
        try {
            await axios
            .put(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/inventory_be/${encodeURIComponent(itemID)}?db=${db}`, item, {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              }) 
        } catch (error) {
            console.error('Error updating items:', error);
          }
        navigate(`/inventory?db=${db}`);
    }

    return (
        <div>
            <Navbar />
            <div className='topbar'>
                <h1 className="title">Edit Item</h1>
            </div>
            <div className='order_table'>
                <form onSubmit={(e) => {e.preventDefault(); setIsConfirmationOpen(true);}}>
                <div className='transfer_info_main'>
                <div className='transfer_info'>
                <div>
                    <h5 htmlFor='image'>Upload Image</h5>
                    <input
                        type='file'
                        id='image'
                        accept='image/*'
                        onChange={(e) => handleImageChange(e.target.files[0])}
                    />
                    {/* <img width="100" height="100" src={`${window.location.protocol}//${window.location.hostname}:${window.location.port}/documents/${db}` + item.picture} /> */}
                </div>
                <div className='input-box'>
                    <h5>Item Name</h5>
                    <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) => handleItemChange(e.target.value, 'itemName')}
                        style={{ outline: '2px solid black' }}
                        required
                    />
                </div>
                <div className='input-box'>
                    <h5>Description</h5>
                    <textarea
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(e.target.value, 'description')}
                        style={{ outline: '2px solid black', width: '500px' }} 
                    />
                </div>
                <div className='input-box'>
                    <h5>Cabinet</h5>
                    <input
                        type="number"
                        value={item.cabinet}
                        onChange={(e) => handleItemChange(e.target.value, 'cabinet')}
                        style={{ outline: '2px solid black' }}
                        required
                    />
                </div>
                <div className='input-box'>
                    <h5>Counter</h5>
                    <input
                        type="number"
                        value={item.counter}
                        onChange={(e) => handleItemChange(e.target.value, 'counter')}
                        style={{ outline: '2px solid black' }}
                    />
                </div>
                {/* <div className='input-box'>
                    <h5>Ordered</h5>
                    <input
                        type="number"
                        value={item.ordered}
                        onChange={(e) => handleItemChange(e.target.value, 'ordered')}
                        style={{ outline: '2px solid black' }}
                    />
                </div>
                <div className='input-box'>
                    <h5>Lost/Damaged</h5>
                    <input
                        type="number"
                        value={item.lostDamaged}
                        onChange={(e) => handleItemChange(e.target.value, 'lostDamaged')}
                        style={{ outline: '2px solid black' }}
                    />
                </div> */}
                <div className='input-box'>
                    <h5>Remarks</h5>
                    <textarea
                        type="textarea"
                        value={item.remarks}
                        onChange={(e) => handleItemChange(e.target.value, 'remarks')}
                        style={{ outline: '2px solid black', width: '500px' }} 
                    />
                </div>

                </div>
                </div>
                <div className='submission_buttons'>
                <button className="submit-button" type="submit">Save</button>
                <button className="cancel-button" onClick={() => navigate(`/inventory?db=${db}`)}>Cancel</button>
                </div>

                </form>
            </div>
            <Confirmation
            isOpen={isConfirmationOpen}
            onClose={() => setIsConfirmationOpen(false)}
            onSubmit={handleSaveItemChanges}/>
        </div>
    )
}

// module.exports = EditItem;
export default EditItem;