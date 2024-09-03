import axios from "axios";
import React, { useEffect, useState } from 'react';
import { MdOutlineAddBox } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import Navbar from "../components/navbar";
import Confirmation from "../components/confirmation";
import NewDeliveryForm from "../components/NewDeliveryForm";
import Modal from "../components/modal";

const Orders = () => {
    const [formData, setFormData] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    // const [sortAttribute, setSortAttribute] = useState(''); // State for sort attribute
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [statusChange, setStautsChange] = useState({status: '', id: null, items: null});
    const [selectedRows, setSelectedRows] = useState([]); // State to track selected rows

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

    const handleRowSelect = (item) => {
      if (selectedRows.includes(item)) {
        setSelectedRows(selectedRows.filter(selected => selected !== item));
      } else {
        setSelectedRows([...selectedRows, item]);
      }
    };

    const handleNewDelivery = async () => {
      setIsModalOpen(false);

      const itemsToUpdate = {doDate: formData.doDate, doNumber: formData.doNumber, doDocument: formData.doDocument, items: selectedRows}
      console.log(itemsToUpdate);
      await axios
      .put('http://localhost:3000/orders/fulfillorder', itemsToUpdate, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      console.log('Acknowledged items:', itemsToUpdate);
      // Your acknowledge logic here
    };


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
            {selectedRows.length > 0 && (
              <button onClick={() => setIsModalOpen(true)} className='acknowledgeButton'>
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
                              <th style={{ fontWeight: 'bold' }}>DO Date</th>
                              <th style={{ fontWeight: 'bold' }}>DO Number</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredInventory.map((item, index) => {
                                const poDate = new Date(item.poDate);
                                const formattedPoDate = `${String(poDate.getDate()).padStart(2, '0')}/${String(poDate.getMonth() + 1).padStart(2, '0')}/${poDate.getFullYear()}`;
                                const doDate = new Date(item.doDate);
                                const formattedDoDate = `${String(doDate.getDate()).padStart(2, '0')}/${String(doDate.getMonth() + 1).padStart(2, '0')}/${doDate.getFullYear()}`;
                                return ((
                                    <tr key={index}>
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={selectedRows.includes(item)}
                                            onChange={() => handleRowSelect(item)}
                                            disabled={item.status === "Fulfilled"} 
                                          />
                                        </td>
                                        <td>{item.itemName}</td>
                                        <td>{formattedPoDate}</td>
                                        <td>
                                          <a href={`/orders/pdf/${item.poDocument}`} target="_blank" rel="noopener noreferrer">
                                            {item.poNumber}
                                          </a>
                                        </td>
                                        <td>{item.quantity}</td>
                                        <td style={{
                                          color: 
                                            item.status === 'Pending'
                                              ? '#FF922C'
                                              : item.status === 'Fulfilled'
                                              ? '#238823'
                                              : item.status === 'Cancelled'
                                              ? '#D2222D'
                                              : 'black', // default color
                                        }}>{item.status}</td>
                                        <td>{(item.doDate === null) ? (item.doDate) : (formattedDoDate)}</td>
                                        <td>
                                          <a href={`/orders/pdf/${item.doDocument}`} target="_blank" rel="noopener noreferrer">
                                            {item.doNumber}
                                          </a>
                                        </td>
                                        
                                    </tr>
                                ))
                          })}
                      </tbody>
                  </table>
                </div>
            )}
      {isModalOpen && (
        <Modal
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleNewDelivery}
          onClose={() => setIsModalOpen(false)}
          FormComponent={NewDeliveryForm}
        />
      )}
    </div>

)
}
   
  

export default Orders