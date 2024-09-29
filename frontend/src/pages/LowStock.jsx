// const axios = require('axios');
// const React = require('react');
// const { useEffect, useState } = React;
// const { RxCross1 } = require('react-icons/rx');
// const Navbar = require('../components/navbar');

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import Navbar from '../components/navbar.jsx';
import { useLocation } from 'react-router-dom';



const LowStock = () => {
    const location = useLocation();
    const db = new URLSearchParams(location.search).get('db');

    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // State for search input

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async (sortAtt) => {
        await axios
        .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/inventory_be?db=${db}`, {params: {sortBy: sortAtt}})
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

    const filteredInventory = inventory.filter((item) =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleLowStockChange = async (name, newLowStock) => {
        
        await axios
        .put(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/inventory_be/lowstock?db=${db}`, {name: name, newLowStock: newLowStock});
        fetchInventory();
    }

  return (
    <div>
            <Navbar />
            <div className='topbar'>
                <h1 className="title">Set Low Stock Limit</h1>
                <input 
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className='searchBar'
                />
                {/* <select onChange={(e) => {fetchInventory(e.target.value)}} className='sortDropdown'>
                    <option value="">Sort by...</option>
                    <option value="name">Item Name</option>
                    <option value="serial">Serial Number</option>
                    <option value="quantity">Quantity</option>
                </select>
                <RxCross1 title='Reset' className='addButton' onClick={handleReset} /> */}
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="inventory_table">
                  <table>
                      <thead>
                          <tr>
                              <th style={{ fontWeight: 'bold' }}>Item Name</th>
                              <th style={{ fontWeight: 'bold' }}>Currrent Quantity</th>
                              <th style={{ fontWeight: 'bold' }}>Low Stock Limit</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredInventory.map((item, index) => (
                              <tr key={index}>
                              <td>{item.itemName}</td>
                              <td>{item.cabinet}</td>
                              <td>
                              <input
                                    type="number"
                                    value={item.lowStock}
                                    onChange={(e) => handleLowStockChange(item.itemName, e.target.value)}
                                />
                              </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                </div>
            )}
      </div>
  )
}

// module.exports = LowStock;
export default LowStock;