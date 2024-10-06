// const React = require('react');
// const { useState, useEffect } = React;
// const axios = require('axios');
// const Navbar = require('../components/navbar');
// const Confirmation = require('../components/confirmation');
// const { useNavigate } = require('react-router-dom');

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar.jsx';
import Confirmation from '../components/confirmation.jsx';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const NewTransfer = ({}) => {
  const location = useLocation();
  const db = new URLSearchParams(location.search).get('db');
    const navigate = useNavigate(); 
    const [items, setItems] = useState([]);
    const [labs, setLabs] = useState([]);
    const [transferItems, setTransferItems] = useState([]);
    const [transferInfo, setTransferInfo] = useState({db: db, destination: '', date: new Date().toISOString().split('T')[0], recipient: '', email: '', status: '', type:"Transfer Out", remarks:'', sender:'' });
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const x = '';
  
    useEffect(() => {
      fetchItems();
      fetchLabs();
    }, []);

    const fetchItems = async () => {
      try {
        await axios
        .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/inventory_be?db=${db}`)
        .then((res) => {
            setItems(res.data.recordset);
        })
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    const fetchLabs = async () => {
      try {
        await axios
        .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/transfers_be/labs?db=${db}`)
        .then((res) => {
            setLabs(res.data.recordset);
        })
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
  
    const handleAddTransferItem = (name) => {
      setTransferItems([...transferItems, { name: name, quantity: 0 }]);
    };

    const handleTransferInfoChange = (e, info) => {
      setTransferInfo(prevState => ({
        ...prevState,
        [info]: e  // Replace with the new value for destination
      }));
    }
  
    const handleInputChange = (index, field, value) => {
      const updatedItems = [...transferItems];
      updatedItems[index][field] = value;
      setTransferItems(updatedItems);
    }

    const handleDeleteOrderItem = (indexToRemove) => {
      const updatedItems = transferItems.filter((item, index) => index !== indexToRemove);
      setTransferItems(updatedItems);
    } 

    const handleSubmitTransfer = async () => {
      const newTransfer = {info: transferInfo, items: transferItems}
      // let transferID, transferType;

      try {
        setIsConfirmationOpen(false);
        navigate(`/transfers?db=${db}`);
        await axios
        .post(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/transfers_be/newtransfer?db=${db}`, newTransfer)
        .then((res) => {
          // transferID = res.data.recordset[0].transferID
        });
      } catch (error) {
        console.error('Error updating items:', error);
      }

      // try {
      //   await axios
      //   .post(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/transfers_be/newtransfer/additems?transferID=${encodeURIComponent(transferID)}&db=${db}`, transferItems)
      // } catch (error) {
      //   console.error('Error updating items:', error);
      // }

      // try {
      //   let type;
      //   if (transferInfo.destination.includes('Counter')) {
      //     type = 'counter'
      //   }
      //   else if (transferInfo.destination.includes('Cabinet')) {
      //     type = 'cabinet'
      //   }
      //   else if (transferInfo.type === 'Unaccounted') {
      //     type = 'unaccounted'
      //   }
      //   else {
      //     return;
      //   }

      //   await axios
      //     .put(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/transfers_be/updateinventory?type=${type}&?db=${db}`, transferItems)
        
      // } catch (error) {
      //   console.error('Error updating items:', error);
      // }

    }
    
    const filteredItems = items
    .filter((item) => {
      return (
        (!searchQuery || item.itemName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    })
  

    return (
      <div>
        <Navbar />
        <div className='topbar'>
          <h1 className="title">New Transfer Form</h1>
        </div>
        
        <div className='order_table'> 
          {labs.length > 0 && (
            
            <div className='transfer_info_main'>
              <div className='transfer_info'>
                <div className='transfer-info-input'>
                  <h5>Type</h5>
                  <select value={transferInfo.type} onChange={(e) => handleTransferInfoChange(e.target.value, 'type')}>
                    <option value="Transfer Out">Transfer Out</option>
                    <option value="Transfer In">Transfer In</option>
                    <option value="Loan">Loan</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>
                <div className='transfer-info-input'>
                  <h5>Destination</h5>
                  <select value={transferInfo.destination} onChange={(e) => handleTransferInfoChange(e.target.value, 'destination')}>
                    <option value="">Select Lab</option>
                    {labs
                        .filter(item => item.type === (transferInfo.type === 'Miscellaneous' ? ('Miscellaneous') : ('All')))
                        .map(item => (
                          <option key={item.id} value={item.labCode}>
                            {item.labCode}
                          </option>
                      ))}
                  </select>
                </div>
                <div className='transfer-info-input'>
                  <h5>Date</h5>
                    <input
                      type="date"
                      value={transferInfo.date}
                      onChange={(e) => handleTransferInfoChange(e.target.value, 'date')}
                    />
                </div>
              </div>


                
                  <div className='transfer_info'>
                    {!(transferInfo.type === 'Miscellaneous') && (
                    <>
                    <div className='transfer-info-input'>
                      <h5>Sender</h5>
                      <input
                        type="text"
                        value={transferInfo.sender}
                        onChange={(e) => handleTransferInfoChange(e.target.value, 'sender')}
                      />
                    </div>
                    <div className='transfer-info-input'>
                      <h5>Recipient</h5>
                      <input
                        type="text"
                        value={transferInfo.recipient}
                        onChange={(e) => handleTransferInfoChange(e.target.value, 'recipient')}
                      />
                    </div>
                    <div className='transfer-info-input'>
                      <h5>Recipient<br />Email</h5>
                      <input
                        type="text"
                        value={transferInfo.email}
                        onChange={(e) => handleTransferInfoChange(e.target.value, 'email')}
                    />
                    </div>
                    </>
                      )}
                    <div className='transfer-info-input'>
                      <h5>Remarks</h5>
                      <textarea
                        type="text"
                        value={transferInfo.remarks}
                        onChange={(e) => handleTransferInfoChange(e.target.value, 'remarks')}
                      />
                    </div>
                  </div>

              </div>
          )}


          <div className='new-order-table'>

            <div className='new-order-table-database'>
              <input
                type="text"
                value={searchQuery}
                placeholder="Search for item"
                onChange={(e) => {setSearchQuery(e.target.value)}}
                className="add-item-search-input"
              />
              {filteredItems.length > 0 && (
                <table>
                  <thead>
                    <tr>
                      <th className='table-header-title'>Item</th>
                    </tr>
                  </thead>
                  <tbody className='inventory-table-body'>
                    {filteredItems.map((item, index) => (
                      <tr key={index}>
                        <td onMouseDown={() => {handleAddTransferItem(item.itemName)}} className='add-item-table-row' key={item.id} style={{cursor:'pointer'}}>
                          {item.itemName}
                        </td>
                      </tr>
                    ))}
                  </tbody >
                </table>
              )}
            </div>

            {transferItems.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th className='table-header-title'>Item</th>
                    <th className='table-header-title'>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {transferItems.map((transferItem, index) => (
                    <tr className='fixed-height-row' key={index}>
                      <td>{transferItem.name}</td>
                      <td>
                        <input
                          type="number"
                          value={transferItem.quantity}
                          onChange={(e) => handleInputChange(index, 'quantity', Number(e.target.value))}
                        />
                      </td>
                      <td><button onClick={() => {handleDeleteOrderItem(index)}}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <button className="submit-button" type="submit" onClick={() => {setIsConfirmationOpen(true)}}>Submit</button>
        </div>
        <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleSubmitTransfer}/>
      </div>
    );
}
  
export default NewTransfer;