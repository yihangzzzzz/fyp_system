import axios from "axios";
import React, { useEffect, useState } from 'react';
import { MdOutlineAddBox } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import Navbar from "../components/navbar";

const Orders = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    // const [sortAttribute, setSortAttribute] = useState(''); // State for sort attribute
    const [editingOrderId, setEditingOrderId] = useState(null);
    
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
        .get("http://localhost:3000/orders", {params: {sortBy: sortAtt}})
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
                <select onChange={(e) => {fetchInventory(e.target.value)}} className='sortDropdown'>
                    <option value="">Sort by...</option>
                    <option value="name">Item Name</option>
                    <option value="quantity">Quantity</option>
                    <option value="date">Date</option>
                </select>
                <RxCross1 title='Reset' className='addButton' onClick={handleReset} />
            </div>
      {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="inventory_table">
                  <table>
                      <thead>
                          <tr>
                              <th style={{ fontWeight: 'bold' }}>Name</th>
                              <th style={{ fontWeight: 'bold' }}>Order Date</th>
                              <th style={{ fontWeight: 'bold' }}>Quantity</th>
                              <th style={{ fontWeight: 'bold' }}>Status</th>
                              <th style={{ fontWeight: 'bold' }}>Reference No.</th>
                              <th style={{ fontWeight: 'bold' }}>PO No.</th>
                              <th style={{ fontWeight: 'bold' }}>Delivery Date</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredInventory.map((item, index) => {
                                const orderdate = new Date(item.orderDate);
                                const formattedOrderDate = `${String(orderdate.getDate()).padStart(2, '0')}/${String(orderdate.getMonth() + 1).padStart(2, '0')}/${orderdate.getFullYear()}`;
                                const deliveryDate = new Date(item.deliveryDate);
                                const formattedDeliveryDate = `${String(deliveryDate.getDate()).padStart(2, '0')}/${String(deliveryDate.getMonth() + 1).padStart(2, '0')}/${deliveryDate.getFullYear()}`;
                                return ((
                                    <tr key={index}>
                                        <td>{item.itemName}</td>
                                        <td>{formattedOrderDate}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.status}</td>
                                        <td>{item.referenceNumber}</td>
                                        <td>{item.poNumber}</td>
                                        <td>{(item.deliveryDate === null) ? (item.deliveryDate) : (formattedDeliveryDate)}</td>
                                    </tr>
                                ))
                          })}
                      </tbody>
                  </table>
                </div>
            )}
    </div>

)
}
   
  

export default Orders