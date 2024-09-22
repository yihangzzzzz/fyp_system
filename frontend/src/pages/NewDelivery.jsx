// const React = require('react');
// const { useState, useEffect } = React;
// const { useNavigate, useLocation } = require('react-router-dom');
// const Navbar = require('../components/navbar');
// const axios = require('axios');
// const Confirmation = require('../components/confirmation');

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import axios from 'axios';
import Confirmation from '../components/confirmation.jsx';


const NewDelivery = () => {

    const location = useLocation();
    const navigate = useNavigate();
    // const { data } = props.location.state;
    const items = location.state || {};
    const [deliveryItems, setDeliveryItems] = useState([]);
    const [deliveryInfo, setDeliveryInfo] = useState({});
    const [doDocument, setDoDocument] = useState();
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);


    useEffect(() => {
        console.log(items);
        setDeliveryItems(items.name)
    }, []);

    const handleDODocumentChange = (e) => {
      setDoDocument(e.target.files[0])
    };

    const handleAddDeliveryInfo = (e, info) => {
      setDeliveryInfo(prevState => ({
        ...prevState,
        [info]: e  // Replace with the new value for destination
      }));
    };

    const handleAddDeliveryItem = (e, orderID) => {
      setDeliveryItems(prevItems =>
        prevItems.map(item =>
          item.orderID === orderID
            ? { ...item, subQuantity: e} // Add quantity if itemName matches
            : item // Leave unchanged if no match
        )
      );
    };

    const handleSubmitDelivery = async () => {

      const newDelivery = {doDocument: doDocument, info: deliveryInfo, items: deliveryItems}
      console.log(newDelivery)

      try {
        await axios
        .post(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/orders/newdelivery`, newDelivery, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
      } catch (error) {
        console.error('Error updating items:', error);
      }




      navigate('/orders');
    }

  return (
    <div>
        <Navbar />
        <div className='topbar'>
          <h1 className="title">New Delivery</h1>
        </div>
        <div className='order_table'>
          <div className='transfer_info'>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
              <h5>Upload DO Document</h5>
              <input
                type="file"
                name='doDocument'
                accept=".pdf"
                // onChange={(e) => handleAddOrderInfo(e.target.files[0], "pdf")}
                // onChange={(e) => setPoDocument(e.target.files[0])}
                onChange={(e) => handleDODocumentChange(e)}
                style={{ outline: '2px solid black' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <h5>DO Number</h5>
                <input
                type="text"
                name="doNumber"
              //   value={orderInfo.poNumber}
                onChange={(e) => handleAddDeliveryInfo(e.target.value, "doNumber")}
                style={{ outline: '2px solid black' }}
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <h5>DO Date</h5>
                <input
                type="date"
                name="doDate"
              //   value={orderInfo.poDate}
                onChange={(e) => handleAddDeliveryInfo(e.target.value, "doDate")}
                style={{ outline: '2px solid black' }}
                />
            </div>
            <div>
              <h4>Enter Quantity Delivered</h4>
              {items.name.map((item, index) => {
                  return(
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <h5>{item.itemName}</h5>
                        <input
                        type="number"
                        name="subQuantity"
                      //   value={orderInfo.poNumber}
                        onChange={(e) => handleAddDeliveryItem(e.target.value, item.orderID)}
                        style={{ outline: '2px solid black' }}
                        />
                    </div>
                  )
              })}
            </div>
          </div>
          <button className="submit-button" type="submit" onClick={() => {setIsConfirmationOpen(true)}}>Submit</button>
        </div>
        <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleSubmitDelivery}/>
        
    </div>
  )
}
// module.exports = NewDelivery
export default NewDelivery;