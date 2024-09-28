// const axios = require('axios');
// const React = require('react');
// const { useEffect, useState } = React;
// const { RxCross1 } = require('react-icons/rx');
// const Navbar = require('../components/navbar');
// const Confirmation = require('../components/confirmation');
// const NewDeliveryForm = require('../components/NewDeliveryForm');
// const Modal = require('../components/modal');
// const { useNavigate, useHistory } = require('react-router-dom');

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import Navbar from '../components/navbar.jsx';
import Confirmation from '../components/confirmation.jsx';
import NewDeliveryForm from '../components/NewDeliveryForm.jsx';
import Modal from '../components/modal.jsx';
import { useNavigate, useHistory } from 'react-router-dom';
import { FaMagnifyingGlass } from "react-icons/fa6";
import FilterModal from '../components/filterModal.jsx';
import { DownloadTable } from '../functions/downloadTable.jsx';



const Orders = () => {
    const navigate = useNavigate();
    // const history = useHistory();
    const [formData, setFormData] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortQuery, setSortQuery] = useState(''); // State for search input
    const [filterQuery, setFilterQuery] = useState({});
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    // const [sortAttribute, setSortAttribute] = useState(''); // State for sort attribute
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [statusChange, setStautsChange] = useState({status: '', id: null, items: null});
    const [selectedRows, setSelectedRows] = useState([]); // State to track selected rows
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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
        .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/orders`, {params: {sortBy: sortAtt}})
        .then((res) => {
            setInventory(res.data.recordset);
            console.log("orders are ", res.data.recordset);
            setLoading(false);
        })
        .catch((error) => {
            console.log("le error is " + error);
            setLoading(false);
        });
    }
    const handleSearch = (e) => {
      // setSearchQuery(e.target.value); 

    };

    const handleReset = () => {
        setSearchQuery("");
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
        // Check if filterQuery.itemName is present, if so, filter based on itemName
        (!filterQuery.itemName || item.itemName.toLowerCase().includes(filterQuery.itemName.toLowerCase())) &&
        
        // Check if filterQuery.poDate is present, if so, filter based on poDate
        (!filterQuery.poStartDate || new Date(item.poDate) >= new Date(filterQuery.poStartDate)) &&

        (!filterQuery.poEndDate || new Date(item.poDate) <= new Date(filterQuery.poEndDate)) &&
        
        // Check if filterQuery.poNumber is present, if so, filter based on poNumber
        (!filterQuery.poNumber || item.poNumber.includes(filterQuery.poNumber)) && 

        (!filterQuery.status || item.status.includes(filterQuery.status)) 
      );
    })
    .sort((a, b) => {
      if (sortQuery === 'name') {
          return a.itemName.localeCompare(b.itemName);
      } else if (sortQuery === 'po') {
          return a.poDate - b.poDate;
      } else if (sortQuery === 'do') {
        return a.items.split(':')[2] - b.items.split(':')[2];
    } 
      // Add more sort options as needed
  });;

    const handleRowSelect = (item) => {
      if (selectedRows.includes(item)) {
        setSelectedRows(selectedRows.filter(selected => selected !== item));
      } else {
        setSelectedRows([...selectedRows, item]);
      }
    };

    // const handleNewDelivery = async () => {
    //   setIsModalOpen(false);

    //   const itemsToUpdate = {doDate: formData.doDate, doNumber: formData.doNumber, doDocument: formData.doDocument, items: selectedRows}
    //   console.log(itemsToUpdate);
    //   await axios
    //   .put(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/orders/fulfillorder`, itemsToUpdate, {
    //     headers: {
    //       "Content-Type": "multipart/form-data"
    //     }
    //   })

    //   console.log('Acknowledged items:', itemsToUpdate);
    //   // Your acknowledge logic here
    // };

    const ackNewDelivery = async () => {
      navigate('/orders/newdelivery', { state: { name: selectedRows.map(item => ({
        orderID: item.orderID,
        itemName: item.itemName,
        totalQuantity: item.quantity,
        deliveredQuantity: item.deliveredQuantity || 0
      })) } });
    };

    // const openFilterModal = () => {
    //     setIsFilterModalOpen(true); // Open the modal
    // };

    // const closeFilterModal = () => {
    //     setIsFilterModalOpen(false); // Close the modal
    // };


  return (
    <div>
      <Navbar />
      <div className='topbar'>
                <h1 className="title">Order Records</h1>
                {/* <MdOutlineAddBox title='Add New Item' className='addButton' onClick={() => setIsModalOpen(true)} /> */}
                {/* <input 
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className='searchBar'
                /> */}
                <select onChange={(e) => {setSortQuery(e.target.value)}} className='sortDropdown'>
                    <option value="">Sort by...</option>
                    <option value="name">Item Name</option>
                    <option value="po">PO Date</option>
                    <option value="do">DO Date</option>
                </select>
                {/* <RxCross1 title='Reset' className='addButton' onClick={() => {setFilterQuery({})}} /> */}
                <button className='print-button' onClick={() => {DownloadTable('table-to-print', 'PO & DO Records Report')}}>Print Table as PDF</button>
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
                   {/* <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}> */}
                   <div className="input-field">
                      <h5>PO Date</h5>
                      <input
                        type="date"
                        name='poStartDate'
                        value={filterQuery.poStartDate || ''}
                        onChange={(e) => handleSetFilters(e.target.name, e.target.value)}
                        // onChange={(e) => setPoDocument(e.target.files[0])}
                        // onChange={(e) => handleAddPODocument(e.target.files[0])}
                        style={{ outline: '2px solid black' }}
                      />
                                            <input
                        type="date"
                        name='poEndDate'
                        value={filterQuery.poEndDate || ''}
                        onChange={(e) => handleSetFilters(e.target.name, e.target.value)}
                        // onChange={(e) => setPoDocument(e.target.files[0])}
                        // onChange={(e) => handleAddPODocument(e.target.files[0])}
                        style={{ outline: '2px solid black' }}
                      />
                   </div>
                   <div className='inputs'>
                   <div className="input-field">
                      <h5>PO Number</h5>
                      <input
                        type="text"
                        name='poNumber'
                        value={filterQuery.poNumber || ''}
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
                      <option value="Fulfilled">Fulfilled</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                    </div>

                   </div>

                  </div>
                  {selectedRows.length > 0 && (
                    // <button onClick={() => setIsModalOpen(true)} className='acknowledgeButton'>
                    <button onClick={() => ackNewDelivery()} className='acknowledgeButton'>
                      Acknowledge
                    </button>
                  )}
                  <table className='inventory-table' id='table-to-print'>
                      <thead>
                          <tr>
                              <th style={{ fontWeight: 'bold' }}></th>
                              <th style={{ fontWeight: 'bold' }}>Name</th>
                              <th style={{ fontWeight: 'bold' }}>PO Date</th>
                              <th style={{ fontWeight: 'bold' }}>PO Number</th>
                              <th style={{ fontWeight: 'bold' }}>Quantity</th>
                              <th style={{ fontWeight: 'bold' }}>Status</th>
                              <th style={{ fontWeight: 'bold' }}>Remaining</th>
                              <th style={{ fontWeight: 'bold' }}>Delivered</th>
                              <th style={{ fontWeight: 'bold' }}>DO Date</th>
                              <th style={{ fontWeight: 'bold' }}>DO Number</th>
                          </tr>
                      </thead>
                      <tbody className='inventory-table-body'>
                          {filteredInventory.map((item, index) => {

                                const itemsArray = item.items.split(', ');
                                const rowSpan = itemsArray.length;

                                const poDate = new Date(item.poDate);
                                const formattedPoDate = `${String(poDate.getDate()).padStart(2, '0')}/${String(poDate.getMonth() + 1).padStart(2, '0')}/${poDate.getFullYear()}`;
                                
                                return (
                                  <>
                                  {itemsArray.map((itemDetail, idx) => {

                                    const doDate = new Date(itemDetail.split(':')[2]);
                                    const formattedDoDate = `${String(doDate.getDate()).padStart(2, '0')}/${String(doDate.getMonth() + 1).padStart(2, '0')}/${doDate.getFullYear()}`;

                                    return (
                                    <tr key={`${index}-${idx}`}>
                                      {idx === 0 && (
                                        <>
                                    <td rowSpan={rowSpan}>
                                      <input
                                        type="checkbox"
                                        checked={selectedRows.includes(item)}
                                        onChange={() => handleRowSelect(item)}
                                        disabled={item.status === "Fulfilled"} 
                                      />
                                    </td>
                                    <td rowSpan={rowSpan}>{item.itemName}</td>
                                    <td rowSpan={rowSpan}>{formattedPoDate}</td>
                                    <td rowSpan={rowSpan}>
                                      <a href={`/orders/pdf/${item.poDocument}`} target="_blank" rel="noopener noreferrer">
                                        {item.poNumber}
                                      </a>
                                    </td>
                                    <td rowSpan={rowSpan}>{item.quantity}</td>
                                    <td rowSpan={rowSpan} style={{
                                      color: 
                                        item.status === 'Pending'
                                          ? '#FF922C'
                                          : item.status === 'Fulfilled'
                                          ? '#238823'
                                          : item.status === 'Cancelled'
                                          ? '#D2222D'
                                          : 'black', // default color
                                    }}>{item.status}</td>
                                    <td rowSpan={rowSpan} >{item.quantity - item.deliveredQuantity}</td>
                                    </>
                                      )}
                                    <td>{itemDetail.split(':')[0]}</td>
                                    {/* <td>{(itemDetail.split(':')[2] === null) ? ('') : (formattedDoDate)}</td> */}
                                    <td>{!itemDetail.split(':')[2] ? '' : formattedDoDate}</td>
                                    <td>
                                      <a href={`/orders/pdf/${itemDetail.split(':')[3]}`} target="_blank" rel="noopener noreferrer">
                                      {itemDetail.split(':')[1]}
                                      </a>
                                    </td>
                                    
                                </tr>
                          )})}

                                  </>

                                  
                                    
                                )
                          })}
                      </tbody>
                  </table>
                </div>
            )}
      {/* {isFilterModalOpen && (
        <FilterModal
          onSubmit={(filters) => setFilterQuery(filters)}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )} */}
    </div>

)
}
   
  

// module.exports = Orders
export default Orders;