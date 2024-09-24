// const axios = require('axios');
// const React = require('react');
// const { useEffect, useState } = React;
// const { RxCross1 } = require('react-icons/rx');
// const Actions = require('../components/actions');
// const Modal = require('../components/modal');
// const Navbar = require('../components/navbar');
// const NewItemForm = require('../components/NewDeliveryForm');
// const Confirmation = require('../components/confirmation');

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import Actions from '../components/actions.jsx';
import Modal from '../components/modal.jsx';
import Navbar from '../components/navbar.jsx';
import NewItemForm from '../components/NewDeliveryForm.jsx';
import Confirmation from '../components/confirmation.jsx';
import { DownloadTable } from '../components/downloadTable.jsx';


const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); 
    const [sortQuery, setSortQuery] = useState(''); // State for search input
    // const [sortAttribute, setSortAttribute] = useState(''); // State for sort attribute
    const [editingOrderId, setEditingOrderId] = useState(null);
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
        .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/inventory`, {params: {sortBy: sortAtt}})
        // .get(`http://localhost:3000/inventory`, {params: {sortBy: sortAtt}})
        .then((res) => {
            setInventory(res.data.recordset);
            setLoading(false);
            console.log(inventory);
        })
        .catch((error) => {
            console.log("le error is " + error);
            setLoading(false);
        });
    }

    // const handleAddItem = (newItem) => {
    //   axios
    //     .post(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/inventory`, newItem)
    //     .then(() => {
    //         setLoading(false);
            
    //     })
    //     .catch((error) => {
    //       console.log("Error adding item: " + error);
    //       setLoading(false);
    //     });
    //     setIsModalOpen(false);
    //     fetchInventory();

    // };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value); // Update search query as the user types
    };

    const handleReset = () => {
        setSearchQuery("");
        setSortQuery('');
        fetchInventory();
    }

    const handleSetFilters = (field, value) => {
        setFilterQuery((prevFilters) => ({
          ...prevFilters, // Spread the previous state
          [field]: value, // Add new key or update existing key
        })); // Update search query as the user types
      }

    const filteredInventory = inventory
        .filter((item) => {
            return (
            //   (!filterQuery.itemName || item.itemName.toLowerCase().includes(filterQuery.itemName.toLowerCase())) &&
            // Check if filterQuery.itemName is present, if so, filter based on itemName
            (!filterQuery.itemName || item.itemName.toLowerCase().includes(filterQuery.itemName.toLowerCase())) &&
            // Check if filterQuery.poNumber is present, if so, filter based on poNumber
            (!filterQuery.lowStock || item.cabinet < item.lowStock)
            );
        })
        // .sort()
        .sort((a, b) => {
            if (sortQuery === 'name') {
                return a.itemName.localeCompare(b.itemName);
            } else if (sortQuery === 'cabinet') {
                console.log("cabinet sort runs");
                return a.cabinet - b.cabinet;
            }
            else return
            // Add more sort options as needed
        });

    const printTableToPDF = () => {
        DownloadTable('table-to-print', 'Inventory Report');
    }

    return (

        <div>
            <Navbar />
            <div className='topbar'>
                <h1 className="title">Hardware Inventory</h1>
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
                    {/* <option value="serial">Serial Number</option> */}
                    <option value="cabinet">Quantity</option>
                </select>
                {/* <RxCross1 title='Reset' className='addButton' onClick={() => {setFilterQuery({})}} /> */}
                <button onClick={() => {DownloadTable('table-to-print', 'Inventory Report')}}>Print Table as PDF</button>
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
                      <h5>Low Stock</h5>
                      <input
                        type="checkbox"
                        name="lowStock" // Updated the name for clarity
                        checked={filterQuery.lowStock || false} // Set checked state based on filterQuery
                        onChange={(e) => handleSetFilters(e.target.name, e.target.checked)} // Handle checkbox state
                        style={{ outline: '2px solid black' }}
                    />
                   </div>

                  </div>
                  <table className='inventory-table' id='table-to-print'>
                      <thead>
                          <tr>
                              <th style={{ fontWeight: 'bold' }}>Picture</th>
                              <th style={{ fontWeight: 'bold' }}>Item Name</th>
                              <th style={{ fontWeight: 'bold' }}>Description</th>
                              {/* <th style={{ fontWeight: 'bold' }}>Serial Number</th> */}
                              <th style={{ fontWeight: 'bold' }}>Cabinet</th>
                              <th style={{ fontWeight: 'bold' }}>Counter</th>
                              <th style={{ fontWeight: 'bold' }}>Ordered</th>
                              <th style={{ fontWeight: 'bold' }}>Lost/Damaged</th>
                              <th style={{ fontWeight: 'bold' }}>Remarks</th>
                              <th style={{ fontWeight: 'bold' }}>Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredInventory.map((item, index) => (
                              <tr key={index}>
                              <td> <img width="100" height="100" src={`${window.location.protocol}//${window.location.hostname}:${window.location.port}/images/` + item.picture} /></td>
                              <td>{item.itemName}</td>
                              {/* <td>{item.serialNumber}</td> */}
                              <td>{item.description}</td>
                              {item.cabinet < item.lowStock ? (
                                <td style={{ backgroundColor: '#f85a68 ', color: 'white' }}>{item.cabinet}</td>
                              ) : (
                                <td>{item.cabinet}</td>
                              )}
                              <td>{item.counter}</td>
                              <td>{item.ordered}</td>
                              <td>{item.lostDamaged}</td>
                              <td>{item.remarks}</td>
                              <td>
                              {editingOrderId === index ? ( <h1>pls</h1>
                                ) : (
                                    <Actions
                                    toDelete={item.itemName}
                                    toEdit={item.itemName}/>
                                    // <Actions/>
                                )}
                              </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                </div>
            )}
      </div>

    );
}

// module.exports = Inventory
export default Inventory;