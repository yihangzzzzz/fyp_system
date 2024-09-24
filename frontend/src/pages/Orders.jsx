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



const Orders = () => {
    const navigate = useNavigate();
    // const history = useHistory();
    const [formData, setFormData] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortQuery, setSortQuery] = useState(''); // State for search input
    const [filterQuery, setFilterQuery] = useState({itemName: null, poDate: null, poNumber: null});
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    // const [sortAttribute, setSortAttribute] = useState(''); // State for sort attribute
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [statusChange, setStautsChange] = useState({status: '', id: null, items: null});
    const [selectedRows, setSelectedRows] = useState([]); // State to track selected rows
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    useEffect(() => {
        fetchInventory();
        console.log("seacrh query is", searchQuery);
        console.log("inventory is ", filteredInventory);

        if(searchQuery) {
          console.log("got something");
        }
        else {
          console.log("got nothing");
        }
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
      setSearchQuery(e.target.value); 

      //   setFilterQuery((prevFilters) => ({
      //     ...prevFilters, // Spread the previous state
      //     [itemName]: e, // Add new key or update existing key
      // })); // Update search query as the user types
    };

    const handleReset = () => {
        setSearchQuery("");
        fetchInventory();
    }

    const handleSetFilters = () => {

    }

    const filteredInventory = inventory
    .filter((item) => {
      if (searchQuery) {
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
      // if (filterQuery.itemName) {
      //   item.itemName.toLowerCase().includes(filterQuery.itemName.toLowerCase());
      // }
      // if (filterQuery.poDate) {
      //   item.poDate.includes(filterQuery.poDate);
      // }
      // if (filterQuery.poNumber) {
      //   item.poNumber.includes(filterQuery.poNumber);
      // }
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
                <input 
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className='searchBar'
                />
                <select onChange={(e) => {setSortQuery(e.target.value)}} className='sortDropdown'>
                    <option value="">Sort by...</option>
                    <option value="name">Item Name</option>
                    <option value="po">PO Date</option>
                    <option value="do">DO Date</option>
                </select>
                <RxCross1 title='Reset' className='addButton' onClick={handleReset} />
                <FaMagnifyingGlass  
                // title="Filter" 
                // className="searchIcon" 
                onClick={() => setIsFilterModalOpen(true)} 
                style={{ cursor: 'pointer' }} 
            />
            </div>
            {selectedRows.length > 0 && (
              // <button onClick={() => setIsModalOpen(true)} className='acknowledgeButton'>
              <button onClick={() => ackNewDelivery()} className='acknowledgeButton'>
                Acknowledge
              </button>
            )}
           {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="inventory_table">
                  <table>
                      <thead>
                          <tr>
                              <th style={{ fontWeight: 'bold' }}></th>
                              <th style={{ fontWeight: 'bold' }}>Name</th>
                              <th style={{ fontWeight: 'bold' }}>PO Date</th>
                              <th style={{ fontWeight: 'bold' }}>PO Number</th>
                              <th style={{ fontWeight: 'bold' }}>Quantity</th>
                              <th style={{ fontWeight: 'bold' }}>Status</th>
                              <th style={{ fontWeight: 'bold' }}>Sub-Quantity</th>
                              <th style={{ fontWeight: 'bold' }}>DO Date</th>
                              <th style={{ fontWeight: 'bold' }}>DO Number</th>
                          </tr>
                      </thead>
                      <tbody>
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