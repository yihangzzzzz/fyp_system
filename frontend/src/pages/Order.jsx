import { useState } from 'react'
import React from 'react'
import Navbar from '../components/navbar'
import axios from 'axios'

const Order = ({}) => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [orderItems, setOrderItems] = useState([]);
  
    const fetchItems = async () => {
      try {
        await axios
        .get('http://localhost:3000/inventory')
        .then((res) => {
            setItems(res.data.recordset);
        })
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
  
    const handleAddItem = () => {
      fetchItems();
    };
  
    const handleSelectChange = (event) => {
      setSelectedItem(event.target.value);
    };
  
    const handleAddToOrder = () => {
      if (selectedItem) {
        setOrderItems([...orderItems, { id: selectedItem, date: '', quantity: '' }]);
        setSelectedItem(''); // Clear the selection after adding
      }
    };
  
    const handleInputChange = (index, field, value) => {
      const updatedItems = [...orderItems];
      updatedItems[index][field] = value;
      setOrderItems(updatedItems);
    };
  
    return (
      <div>
        <Navbar />
        <div className='topbar'>
          <h1 className="title">Order Form</h1>
        </div>
        <div>
          <button onClick={handleAddItem} className="add-item-button" style={{ backgroundColor: 'blue', color: 'white' }}>Add Item</button>
          {items.length > 0 && (
            <div>
              <select value={selectedItem} onChange={handleSelectChange}>
                <option value="">Select an item...</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>
                    {item['Item Name']}
                  </option>
                ))}
              </select>
              <button onClick={handleAddToOrder}>Add to Order</button>
            </div>
          )}
          {orderItems.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Date</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((orderItem, index) => (
                  <tr key={index}>
                    <td>{items.find(item => item.id === orderItem.id)?.item['Item Name']}</td>
                    <td>
                      <input
                        type="date"
                        value={orderItem.date}
                        onChange={(e) => handleInputChange(index, 'date', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={orderItem.quantity}
                        onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
  
  export default Order;