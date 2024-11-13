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
    const db = new URLSearchParams(location.search).get('db');
    const navigate = useNavigate();
    // const { data } = props.location.state;
    const items = location.state || {};
    const [deliveryItems, setDeliveryItems] = useState([]);
    const [deliveryInfo, setDeliveryInfo] = useState({});
    const [doDocument, setDoDocument] = useState();
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);


    useEffect(() => {
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

      try {
        await axios
        .post(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/orders_be/newdelivery?db=${db}`, newDelivery, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
      } catch (error) {
        console.error('Error updating items:', error);
      }




      navigate(`/orders?db=${db}`);
    }

  return (
    <div>
        <Navbar />
        <div className='topbar'>
          <h1 className="title">New Delivery</h1>
        </div>
        <div className='order_table'>
        <form action="" onSubmit={(e) => {e.preventDefault(); setIsConfirmationOpen(true);}}>
          <div className='transfer_info_main'>
            <div className='transfer_info'>
              <div className='transfer-info-input'>
                <h5>DO Document</h5>
                <input
                  type="file"
                  name='doDocument'
                  accept=".pdf"
                  // onChange={(e) => handleAddOrderInfo(e.target.files[0], "pdf")}
                  // onChange={(e) => setPoDocument(e.target.files[0])}
                  onChange={(e) => handleDODocumentChange(e)}
                  required
                />
              </div>
              <div className='transfer-info-input'>
                <h5>DO Number</h5>
                  <input
                  type="text"
                  name="doNumber"
                //   value={orderInfo.poNumber}
                  onChange={(e) => handleAddDeliveryInfo(e.target.value, "doNumber")}
                  required
                  />
              </div>
              <div className='transfer-info-input'>
                <h5>DO Date</h5>
                  <input
                  type="date"
                  name="doDate"
                //   value={orderInfo.poDate}
                  onChange={(e) => handleAddDeliveryInfo(e.target.value, "doDate")}
                  required
                  />
              </div>
              </div>
          </div>


            <div className='new_delivery_items_table'>

            <table>
              <thead>
                <tr>
                  <th className='table-header-title'>Item</th>
                  <th className='table-header-title'>Total Ordered</th>
                  <th className='table-header-title'>Remaining</th>
                  <th className='table-header-title'>Enter Quantity</th>
                </tr>
              </thead>
              <tbody className='inventory-table-body'>
                {items.name.map((item, index) => (
                  <tr key={index}>
                    <td>{item.itemName}</td>
                    <td>{item.totalQuantity}</td>
                    <td>{item.totalQuantity - item.deliveredQuantity}</td>
                    <td>
                      <input
                        type="number"
                        style={{
                          outline: '2px solid black' // Adds a black outline
                        }}
                        value={item.subQuantity}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value <= (item.totalQuantity - item.deliveredQuantity)) {
                            handleAddDeliveryItem(e.target.value, item.orderID)
                          }
                          else {
                            alert(`Quantity cannot be greater than ${item.totalQuantity - item.deliveredQuantity}`);
                          }
                          
                        }}
                        required
                      />
                    </td>
                    {/* <td><button onClick={() => {handleDeleteOrderItem(index)}}>Delete</button></td> */}
                  </tr>
                ))}
              </tbody>
            </table>




              {/* <h4>Enter Quantity Delivered</h4>
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
              })} */}
            </div>
         
          <button className="submit-button" type="submit">Submit</button>
          </form>
        </div>
        <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleSubmitDelivery}
        message={"Confirm to Add new DO?"}/>
        
    </div>
  )
}
// module.exports = NewDelivery
export default NewDelivery;