import axios from "axios";
import React, { useEffect, useState } from 'react';
import { MdOutlineAddBox } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import Actions from "../components/actions";
import Modal from "../components/modal";
import Navbar from '../components/navbar';
import NewItemForm from "../components/NewDeliveryForm";
import Confirmation from "../components/confirmation";

const Inventory = () => {
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
        .get("http://localhost:3000/inventory", {params: {sortBy: sortAtt}})
        .then((res) => {
            setInventory(res.data.recordset);
            setLoading(false);
        })
        .catch((error) => {
            console.log("le error is " + error);
            setLoading(false);
        });
    }

    const handleAddItem = (newItem) => {
      axios
        .post("http://localhost:3000/inventory", newItem)
        .then(() => {
            setLoading(false);
            
        })
        .catch((error) => {
          console.log("Error adding item: " + error);
          setLoading(false);
        });
        setIsModalOpen(false);
        fetchInventory();

    };

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
                <h1 className="title">Hardware Inventory</h1>
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
                    <option value="serial">Serial Number</option>
                    <option value="quantity">Quantity</option>
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
                              <th style={{ fontWeight: 'bold' }}>Picture</th>
                              <th style={{ fontWeight: 'bold' }}>Item Name</th>
                              <th style={{ fontWeight: 'bold' }}>Serial Number</th>
                              <th style={{ fontWeight: 'bold' }}>Cabinet</th>
                              <th style={{ fontWeight: 'bold' }}>Counter</th>
                              <th style={{ fontWeight: 'bold' }}>Ordered</th>
                              <th style={{ fontWeight: 'bold' }}>Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredInventory.map((item, index) => (
                              <tr key={index}>
                              <td> <img width="100" height="100" src={"http://localhost:3000/images/" + item.picture} /></td>
                              <td>{item.itemName}</td>
                              <td>{item.serialNumber}</td>
                              {item.cabinet < item.lowStock ? (
                                <td style={{ backgroundColor: '#f85a68 ', color: 'white' }}>{item.cabinet}</td>
                              ) : (
                                <td>{item.cabinet}</td>
                              )}
                              <td>{item.counter}</td>
                              <td>{item.ordered}</td>
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

export default Inventory