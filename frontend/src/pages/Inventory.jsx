import axios from "axios";
import React, { useEffect, useState } from 'react';
import { MdOutlineAddBox } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import Actions from "../components/actions";
import Modal from "../components/modal";
import Navbar from '../components/navbar';
import NewItemForm from "../components/newItemForm";

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    const [sortAttribute, setSortAttribute] = useState(''); // State for sort attribute
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
        setSortAttribute("");
        fetchInventory();
    }

    const filteredInventory = inventory.filter((item) =>
        item["Item Name"].toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (

        <div>
            <Navbar />
            <div className='topbar'>
                <h1 className="title">Hardware Inventory</h1>
                <MdOutlineAddBox title='Add New Item' className='addButton' onClick={() => setIsModalOpen(true)} />
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
                              <th style={{ fontWeight: 'bold' }}>Item Name</th>
                              <th style={{ fontWeight: 'bold' }}>Serial Number</th>
                              <th style={{ fontWeight: 'bold' }}>Quantity</th>
                              <th style={{ fontWeight: 'bold' }}>Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredInventory.map((item, index) => (
                              <tr key={index}>
                              <td>{item["Item Name"]}</td>
                              <td>{item["Serial Number"]}</td>
                              <td>{item["Quantity"]}</td>
                              <td>
                              {editingOrderId === index ? ( <h1>pls</h1>
                                ) : (
                                    <Actions
                                    toDelete={item["Item Name"]}/>
                                    // <Actions/>
                                )}
                              </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                </div>
            )}
            <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(newitem) => {handleAddItem(newitem);}}
        FormComponent={NewItemForm}
      />
      </div>

    );
}

export default Inventory