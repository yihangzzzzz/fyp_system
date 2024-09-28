// const axios = require('axios');
// const React = require('react');
// const { useEffect, useState } = React;
// const { RxCross1 } = require('react-icons/rx');
// const Navbar = require('../components/navbar');
// const Confirmation = require('../components/confirmation');
// const { useNavigate } = require('react-router-dom');

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import Navbar from '../components/navbar.jsx';
import Confirmation from '../components/confirmation.jsx';
import { useNavigate } from 'react-router-dom';
import { DownloadTable } from '../functions/downloadTable.jsx';


const Transfers = () => {
    const navigate = useNavigate(); 
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    // const [sortAttribute, setSortAttribute] = useState(''); // State for sort attribute
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [statusChange, setStautsChange] = useState({status: '', id: '', items: ''});
    const [filterQuery, setFilterQuery] = useState({});
    
    
    useEffect(() => {
        fetchInventory();
    }, []);
    // const refreshData = () => {
    //     fetchInventory(setInventory, setLoading);
    //   };
    
    //   useEffect(() => {
    //     refreshData();
    //   }, []);

    const fetchInventory = async (sortAtt) => {
        await axios
        .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/transfers`, {params: {sortBy: sortAtt}})
        .then((res) => {
            setInventory(res.data.recordset);
            setLoading(false);
        })
        .catch((error) => {
            console.log("le error is " + error);
            setLoading(false);
        });
    }
    const handleSearch = (e) => {
        setSearchQuery(e.target.value); // Update search query as the user types
    };

    const handleReset = () => {
        setSearchQuery("");
        fetchInventory();
    }

    const handleTransferStatusChange = async () => {
        setIsConfirmationOpen(false);
        await axios
        .put(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/transfers`, statusChange);
        setStautsChange({status: '', id: null, items: null});
        fetchInventory();
    }

    const handleSetFilters = (field, value) => {
        setFilterQuery((prevFilters) => ({
          ...prevFilters, // Spread the previous state
          [field]: value, // Add new key or update existing key
        })); // Update search query as the user types
        console.log("filters are", filterQuery)
      }

    const filteredInventory = inventory
    .filter((item) => {
        return (
        //   (!filterQuery.itemName || item.itemName.toLowerCase().includes(filterQuery.itemName.toLowerCase())) &&
          // Check if filterQuery.itemName is present, if so, filter based on itemName
          (!filterQuery.destination || item.destination.toLowerCase().includes(filterQuery.destination.toLowerCase())) &&

          (!filterQuery.type || item.type.includes(filterQuery.type)) &&
          
          // Check if filterQuery.poDate is present, if so, filter based on poDate
          (!filterQuery.transferStartDate || new Date(item.date) >= new Date(filterQuery.transferStartDate)) &&
  
          (!filterQuery.transferEndDate || new Date(item.date) <= new Date(filterQuery.transferEndDate)) &&
          
          // Check if filterQuery.poNumber is present, if so, filter based on poNumber
          (!filterQuery.recipient || item.recipient.toLowerCase().includes(filterQuery.recipient.toLowerCase())) && 
  
          (!filterQuery.status || item.status.includes(filterQuery.status)) && 

          (!filterQuery.itemName || item.items.split(',').some((itemDetail) => {
            const itemName = itemDetail.split(':')[0]; // Extract the item name from the 'itemName:quantity' string
            return itemName.toLowerCase().includes(filterQuery.itemName.toLowerCase());
          }))
        );
      })



  return (
    <div>
      <Navbar />
      <div className='topbar'>
                <h1 className="title">Transfer Records</h1>
                {/* <MdOutlineAddBox title='Add New Item' className='addButton' onClick={() => setIsModalOpen(true)} /> */}
                {/* <input 
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className='searchBar'
                /> */}
                <select onChange={(e) => {fetchInventory(e.target.value)}} className='sortDropdown'>
                    <option value="">Sort by...</option>
                    <option value="name">Item Name</option>
                    <option value="quantity">Quantity</option>
                    <option value="date">Date</option>
                    <option value="destination">Destination</option>
                </select>
                {/* <RxCross1 title='Reset' className='addButton' onClick={() => {setFilterQuery({})}} /> */}
                <button className='print-button' onClick={() => {DownloadTable('table-to-print', 'Transfer Records Report')}}>Print Table as PDF</button>
        </div>
      {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="inventory_table">
                <div className='filter-table'>
                    <div className="filter-header">                    
                        <h4>Filters</h4>
                        <RxCross1 title='Reset' className='addButton' onClick={() => {setFilterQuery({})}} />
                    </div>

                    {/* <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}> */}
                    <div className='inputs'>
                    <div className="input-field">
                      <h5>Item</h5>
                      <input
                        type="text"
                        name='itemName'
                        value={filterQuery.itemName || ''}
                        onChange={(e) => handleSetFilters(e.target.name, e.target.value)}
                        // onChange={(e) => setPoDocument(e.target.files[0])}
                        // onChange={(e) => handleAddPODocument(e.target.files[0])}
                        style={{ outline: '2px solid black' }}
                      />
                   </div>
                   <div className="input-field">
                    <h5>Type</h5>
                    <select
                      name="type"
                      value={filterQuery.type|| ''}
                      onChange={(e) => handleSetFilters(e.target.name, e.target.value)}
                      // onChange={(e) => setPoDocument(e.target.value)}
                      style={{ outline: '2px solid black' }}
                    >
                      <option value="">Select Type</option> {/* Default option */}
                      <option value="Transfer">Transfer</option>
                      <option value="Loan">Loan</option>
                    </select>
                  </div>
                    <div className="input-field">
                      <h5>Destination</h5>
                      <input
                        type="text"
                        name='destination'
                        value={filterQuery.destination || ''}
                        onChange={(e) => handleSetFilters(e.target.name, e.target.value)}
                        // onChange={(e) => setPoDocument(e.target.files[0])}
                        // onChange={(e) => handleAddPODocument(e.target.files[0])}
                        style={{ outline: '2px solid black' }}
                      />
                   </div>
                   {/* <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}> */}
                   <div className="input-field">
                      <h5>Transfer Date</h5>
                      <input
                        type="date"
                        name='transferStartDate'
                        value={filterQuery.transferStartDate || ''}
                        onChange={(e) => handleSetFilters(e.target.name, e.target.value)}
                        // onChange={(e) => setPoDocument(e.target.files[0])}
                        // onChange={(e) => handleAddPODocument(e.target.files[0])}
                        style={{ outline: '2px solid black' }}
                      />
                                            <input
                        type="date"
                        name='transferEndDate'
                        value={filterQuery.transferEndDate || ''}
                        onChange={(e) => handleSetFilters(e.target.name, e.target.value)}
                        // onChange={(e) => setPoDocument(e.target.files[0])}
                        // onChange={(e) => handleAddPODocument(e.target.files[0])}
                        style={{ outline: '2px solid black' }}
                      />
                   </div>
                   <div className="input-field">
                      <h5>Recipient</h5>
                      <input
                        type="text"
                        name='recipient'
                        value={filterQuery.recipient || ''}
                        onChange={(e) => handleSetFilters(e.target.name, e.target.value)}
                        // onChange={(e) => setPoDocument(e.target.files[0])}
                        // onChange={(e) => handleAddPODocument(e.target.files[0])}
                        style={{ outline: '2px solid black' }}
                      />
                   </div>
                   <div className="input-field">
                    <h5>Status</h5>
                    <select
                      name="status"
                      value={filterQuery.status|| ''}
                      onChange={(e) => handleSetFilters(e.target.name, e.target.value)}
                      // onChange={(e) => setPoDocument(e.target.value)}
                      style={{ outline: '2px solid black' }}
                    >
                      <option value="">Select Status</option> {/* Default option */}
                      <option value="Pending">Pending</option>
                      <option value="Acknowledged">Acknowledged</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="On Loan">On Loan</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </div>
                    </div>
                    

                  </div>
                  <table className='inventory-table' id='table-to-print'>
                      <thead>
                          <tr>
                              {/* <th style={{ fontWeight: 'bold' }}>Type</th> */}
                              <th style={{ fontWeight: 'bold' }}>Destination</th>
                              <th style={{ fontWeight: 'bold' }}>Date</th>
                              <th style={{ fontWeight: 'bold' }}>Recipient</th>
                              <th style={{ fontWeight: 'bold' }}>Email</th>
                              <th style={{ fontWeight: 'bold' }}>Transfer Document</th>
                              <th style={{ fontWeight: 'bold' }}>Status</th>
                              {/* <th style={{ fontWeight: 'bold' }}>Description</th> */}
                              <th style={{ fontWeight: 'bold' }}>Items</th>
                              <th style={{ fontWeight: 'bold' }}>Quantity</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredInventory.map((item, index) => {

                                const itemsArray = item.items.split(', ');
                                const rowSpan = itemsArray.length;
                                const date = new Date(item.date);
                                const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

                                return (
                                    <>
                                        {itemsArray.map((itemDetail, idx) => (
                                            
                                            <tr key={`${index}-${idx}`}>
                                                {idx === 0 && (
                                                    <>
                                                        {/* <td rowSpan={rowSpan}>{item.type}</td> */}
                                                        <td rowSpan={rowSpan}>{item.destination}</td>
                                                        <td rowSpan={rowSpan}>{formattedDate}</td>
                                                        <td rowSpan={rowSpan}>{item.recipient}</td>
                                                        <td rowSpan={rowSpan}>{item.email}</td>
                                                        <td rowSpan={rowSpan}>
                                                            <a href={`/transfers/pdf/${item.transferDocument}`} target="_blank" rel="noopener noreferrer">
                                                                VIew PDF
                                                            </a>
                                                        </td>
                                                        {/* <td rowSpan={rowSpan}>{item.description}</td> */}
                                                        <td rowSpan={rowSpan}>
                                                        <select
                                                            disabled={item.status === "Acknowledged" || item.status === "Returned"} 
                                                            value={item.status}
                                                            onChange={(e) => {
                                                                setStautsChange({status: e.target.value, id: item.transferID, items: itemsArray});
                                                                setIsConfirmationOpen(true);
                                                            }}
                                                            style={{
                                                                color: 
                                                                  item.status === 'Pending'
                                                                    ? '#FF922C'
                                                                    : item.status === 'Acknowledged' || item.status === 'Returned'
                                                                    ? '#238823'
                                                                    : item.status === 'Cancelled'
                                                                    ? '#D2222D'
                                                                    : item.status === 'On Loan'
                                                                    ? '#1E90FF'
                                                                    : 'black', // default color
                                                              }}
                                                            >
                                                            {item.type === 'Transfer' ? (
                                                              <>
                                                                <option style={{ color: 'black' }} value="Pending">Pending</option>
                                                                <option style={{ color: 'black' }} value="Acknowledged">Acknowledged</option>
                                                                <option style={{ color: 'black' }} value="Cancelled">Cancelled</option>
                                                              </>
                                                            ) : (
                                                              <>
                                                              <option style={{ color: 'black' }} value="On Loan">On Loan</option>
                                                              <option style={{ color: 'black' }} value="Returned">Returned</option>
                                                            </>
                                                            )}

                                                            </select>
                                                        </td>
                                                    </>
                                                )}
                                                {/* Split itemDetail to separate itemName and quantity */}
                                                <td>{itemDetail.split(':')[0]}</td>
                                                <td>{itemDetail.split(':')[1]}</td>
                                                
                                            </tr>
                                        ))}
                                    </>
                                );


                                // const date = new Date(item.date);
                                // const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                                // return ((
                                //     <tr key={index}>
                                //         <td>{item.destination}</td>
                                //         <td>{formattedDate}</td>
                                //         <td>{item.recipient}</td>
                                //     </tr>
                                // ))
                          })}
                      </tbody>
                  </table>
                </div>
            )}
        <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleTransferStatusChange}/>
    </div>

)
}
   
  

// module.exports = Transfers
export default Transfers;