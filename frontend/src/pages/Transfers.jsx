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
import { useLocation } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import { FaSortAmountDown } from "react-icons/fa";

const Transfers = () => {
  const location = useLocation();
  const db = new URLSearchParams(location.search).get('db');
    const navigate = useNavigate(); 
    const [inventory, setInventory] = useState([]);
    const [inventoryInbound, setInventoryInbound] = useState([]);
    const [inventoryOutbound, setInventoryOutbound] = useState([]);
    const [inventoryMiscellaneous, setInventoryMiscellaneous] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    const [sortQuery, setSortQuery] = useState(''); // State for search input
    // const [sortAttribute, setSortAttribute] = useState(''); // State for sort attribute
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [statusChange, setStautsChange] = useState({status: '', id: null, type: ''});
    const [filterQuery, setFilterQuery] = useState({itemName: ''});
    const [tableMode, setTableMode] = useState('Outbound');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedMode, setSelectedMode] = useState('Outbound');
    const [showSort, setShowSort] = useState(false);
    
    
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
        .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/transfers_be?db=${db}`, {params: {sortBy: sortAtt}})
        .then((res) => {
          setInventoryInbound(res.data.inbound);
          setInventoryOutbound(res.data.outbound);
          setInventoryMiscellaneous(res.data.miscellaneous)
          setInventory(res.data.outbound)
          console.log(res.data.outbound)
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
        .put(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/transfers_be/manualstatuschange?db=${db}`, statusChange);
        setStautsChange({status: '', id: null, type: ''});
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

          (item.items.some((itemDetail) => {
            if (filterQuery.itemName) {
              const itemName = itemDetail.itemName;
              return itemName.toLowerCase().includes(filterQuery.itemName.toLowerCase());
            }
            else {
              return true;
            }
          }))


        );
      })



  return (
    <div>
      <Navbar />
      <div className='topbar'>
                <h1 className="title">Transfer Records</h1>
                <div className="search-container">
                    <input
                        type="text"
                        name='itemName'
                        className="search-input"
                        placeholder="Search for item"
                        value={filterQuery.itemName || ''}
                        onChange={(e) => handleSetFilters(e.target.name, e.target.value)}/>
                    <FaSearch className="search-icon" />
                </div>
                {/* <MdOutlineAddBox title='Add New Item' className='addButton' onClick={() => setIsModalOpen(true)} /> */}
                {/* <input 
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className='searchBar'
                /> */}
                {/* <RxCross1 title='Reset' className='addButton' onClick={() => {setFilterQuery({})}} /> */}
                <button className='print-button' onClick={() => {DownloadTable('table-to-print', 'Transfer Records Report')}}>Print Table as PDF</button>
        </div>
      {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="inventory_table">
                <div className='filter-table'>
                  <div className="filter-header">                    
                      <div className='filter-child-element' onClick={() => {setShowFilters(!showFilters);setShowSort(false)}} style={{ cursor: 'pointer' }}>
                        <h4>Filters</h4>
                        <FaFilter />
                      </div>
                      <div className='filter-child-element' onClick={() => {setShowSort(!showSort);setShowFilters(false)}} style={{ cursor: 'pointer' }}>
                        <h4>Sort</h4>
                        <FaSortAmountDown />
                      </div>
                      <div className='filter-child-element'>
                        <button title='Reset' className='clear-filters-button' onClick={() => {setFilterQuery({itemName : ''});setSortQuery({});}}>Clear Filters</button>
                      </div>

                      {/* <RxCross1 title='Reset' className='addButton' onClick={() => {setFilterQuery({})}} /> */}
                  </div>

                    {/* <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}> */}
                    {showFilters && (
                    <div className='inputs'>
                    {/* <button title='Reset' className='addButton' onClick={() => {setFilterQuery({})}}>Clear Filters</button> */}
                    {/* <div className="input-field">
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
                   </div> */}
                   <div className="input-field">
                    <h5>Type</h5>
                    <select
                      name="type"
                      value={filterQuery.type|| ''}
                      onChange={(e) => handleSetFilters(e.target.name, e.target.value)}
                      // onChange={(e) => setPoDocument(e.target.value)}
                      // style={{ outline: '2px solid black' }}
                    >
                      <option value="">Select Type</option> {/* Default option */}
                      <option value="Transfer Out">Transfer Out</option>
                      <option value="Transfer In">Transfer In</option>
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
                        // style={{ outline: '2px solid black' }}
                      />
                   </div>
                   {/* <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}> */}
                   <div className="input-field">
                      <h5>Transfer Date</h5>
                      <div className='date-range-inputs'>
                      <input
                        type="date"
                        name='transferStartDate'
                        value={filterQuery.transferStartDate || ''}
                        onChange={(e) => handleSetFilters(e.target.name, e.target.value)}
                        // onChange={(e) => setPoDocument(e.target.files[0])}
                        // onChange={(e) => handleAddPODocument(e.target.files[0])}
                        // style={{ outline: '2px solid black' }}
                      />
                      <h5>to</h5>
                        <input
                        type="date"
                        name='transferEndDate'
                        value={filterQuery.transferEndDate || ''}
                        onChange={(e) => handleSetFilters(e.target.name, e.target.value)}
                        // onChange={(e) => setPoDocument(e.target.files[0])}
                        // onChange={(e) => handleAddPODocument(e.target.files[0])}
                        // style={{ outline: '2px solid black' }}
                      />
                      </div>
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
                        // style={{ outline: '2px solid black' }}
                      />
                   </div>
                   <div className="input-field">
                    <h5>Status</h5>
                    <select
                      name="status"
                      value={filterQuery.status|| ''}
                      onChange={(e) => handleSetFilters(e.target.name, e.target.value)}
                      // onChange={(e) => setPoDocument(e.target.value)}
                      // style={{ outline: '2px solid black' }}
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
                    )}
                    {showSort && (
                      <div className='inputs'>
                          <div className='input-field'>
                            <select onChange={(e) => {fetchInventory(e.target.value)}} className='sortDropdown'>
                                <option value="">Sort by...</option>
                                <option value="name">Item Name</option>
                                <option value="quantity">Quantity</option>
                                <option value="date">Date</option>
                                <option value="destination">Destination</option>
                            </select>
                          </div>
                      </div>
                    )}
                    

                  </div>
                  <div className='transfer-main-table'>
                  <div className='transfer-tables-mode'>
                  <button className={`transfer-table-mode-button ${selectedMode === 'Inbound' ? 'selected' : ''}`} onClick={() => {setInventory(inventoryInbound);setSelectedMode('Inbound');}}>Inbound</button>
                  <button className={`transfer-table-mode-button ${selectedMode === 'Outbound' ? 'selected' : ''}`} onClick={() => {setInventory(inventoryOutbound);setSelectedMode('Outbound');}}>Outbound</button>
                  <button className={`transfer-table-mode-button ${selectedMode === 'Miscellaneous' ? 'selected' : ''}`} onClick={() => {setInventory(inventoryMiscellaneous);setSelectedMode('Miscellaneous');}}>Miscellaneous</button>
                  <button className={`transfer-table-mode-button ${selectedMode === 'All' ? 'selected' : ''}`} onClick={() => {setInventory([...inventoryInbound, ...inventoryOutbound, ...inventoryMiscellaneous]);setSelectedMode('All');}}>All</button>
                  </div>
                  <table className='inventory-table' id='table-to-print'>
                      <thead>
                          <tr className='table-header-row'>
                              {/* <th className='table-header-title'>Type</th> */}
                              {selectedMode === 'All' && (<th className='table-header-title'>Type</th>)}
                              <th className='table-header-title'>Destination</th>
                              <th className='table-header-title'>Date</th>
                              {selectedMode != 'Miscellaneous' && (<th className='table-header-title'>Sender</th>)}
                              {selectedMode != 'Miscellaneous' && (<th className='table-header-title'>Recipient</th>)}
                              {selectedMode != 'Miscellaneous' && (<th className='table-header-title'>Email</th>)}
                              <th className='table-header-title'>Transfer Document</th>
                              <th className='table-header-title'>Status</th>
                              {/* <th className='table-header-title'>Description</th> */}
                              <th className='table-header-title'>Items</th>
                              <th className='table-header-title'>Quantity</th>
                              <th className='table-header-title'>Remarks</th>
                          </tr>
                      </thead>
                      <tbody className='inventory-table-body'>
                          {filteredInventory.map((item, index) => {

                                const itemsArray = item.items;
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
                                                        {selectedMode === 'All' && (<td rowSpan={rowSpan}>{item.type}</td>)}
                                                        <td rowSpan={rowSpan}>{item.destination}</td>
                                                        <td rowSpan={rowSpan}>{formattedDate}</td>
                                                        {selectedMode != 'Miscellaneous' && (<td rowSpan={rowSpan}>{item.sender}</td>)}
                                                        {selectedMode != 'Miscellaneous' && (<td rowSpan={rowSpan}>{item.recipient}</td>)}
                                                        {selectedMode != 'Miscellaneous' && (<td rowSpan={rowSpan}>{item.email}</td>)}
                                                        <td rowSpan={rowSpan}>
                                                            <a href={`/transfers_be/pdf/${item.transferDocument}?db=${db}`} target="_blank" rel="noopener noreferrer">
                                                                VIew PDF
                                                            </a>
                                                        </td>
                                                        {/* <td rowSpan={rowSpan}>{item.description}</td> */}
                                                        <td rowSpan={rowSpan}>
                                                        <select
                                                            disabled={item.status === "Acknowledged" || item.status === "Returned"} 
                                                            value={item.status}
                                                            onChange={(e) => {
                                                                setStautsChange({status: e.target.value, id: item.transferID, type: item.type});
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
                                                            {item.type === 'Loan' ? (
                                                              <>
                                                                <option style={{ color: 'black' }} value="Pending">Pending</option>
                                                                <option style={{ color: 'black' }} value="On Loan">On Loan</option>
                                                                <option style={{ color: 'black' }} value="Returned">Returned</option>
                                                              </>
                                                            ) : (
                                                              <>
                                                                <option style={{ color: 'black' }} value="Pending">Pending</option>
                                                                <option style={{ color: 'black' }} value="Acknowledged">Acknowledged</option>
                                                                <option style={{ color: 'black' }} value="Cancelled">Cancelled</option>
                                                            </>
                                                            )}

                                                            </select>
                                                        </td>
 
                                                    </>
                                                    
                                                )}
                                                <td className={`transfer-table-item ${filterQuery.itemName != '' && (itemDetail.itemName.toLowerCase().includes(filterQuery.itemName.toLowerCase())) ? 'selected' : ''}`}>
                                                  {itemDetail.itemName}
                                                </td>
                                                <td className={`transfer-table-item ${filterQuery.itemName != '' && (itemDetail.itemName.toLowerCase().includes(filterQuery.itemName.toLowerCase())) ? 'selected' : ''}`}>
                                                  {itemDetail.quantity}
                                                </td>
                                                {idx === 0 && (
                                                  <td rowSpan={rowSpan}>{item.remarks}</td>
                                                )}
                                                
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