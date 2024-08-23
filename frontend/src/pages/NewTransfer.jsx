import { useState, useEffect} from 'react'
import React from 'react'
import Navbar from '../components/navbar'
import axios from 'axios'

const NewTransfer = ({}) => {
    const [items, setItems] = useState([]);
    const [labs, setLabs] = useState([]);
    // const [selectedItem, setSelectedItem] = useState('');
    const [orderItems, setOrderItems] = useState([]);
    const [transferInfo, setTransferInfo] = useState({destination: '', date: new Date().toISOString().split('T')[0], recipient: '' });
    const x = '';
  
    useEffect(() => {
      fetchItems();
      fetchLabs();
    }, []);

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

    const fetchLabs = async () => {
      try {
        await axios
        .get('http://localhost:3000/transfers/labs')
        .then((res) => {
            setLabs(res.data.recordset);
        })
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
  
    const handleAddItem = () => {
      fetchItems();
    };
  
    const handleSelectChange = (event) => {
      // setSelectedItem(event.target.value);
      const today = new Date().toISOString().split('T')[0];
      setOrderItems([...orderItems, { name: event.target.value, quantity: 0 }]);
      // setSelectedItem(''); // Clear the selection after adding
    };

    const handleTransferInfoChange = (e, info) => {
      setTransferInfo(prevState => ({
        ...prevState,
        [info]: e  // Replace with the new value for destination
    }));
    console.log('New Date:', transferInfo.date);
    // console.log('New Destination:', transferInfo.destination);
        // switch (info) {
        //   case 'destination':
        //     setTransferInfo
            
        // }
    }
  
    // const handleAddToOrder = () => {
    //   if (selectedItem) {
    //     setOrderItems([...orderItems, { name: selectedItem, date: '', quantity: '' }]);
    //     setSelectedItem(''); // Clear the selection after adding
    //   }
    // };
  
    const handleInputChange = (index, field, value) => {
      const updatedItems = [...orderItems];
      updatedItems[index][field] = value;
      setOrderItems(updatedItems);
    };

    const handleDeleteOrderItem = (indexToRemove) => {
      const updatedItems = orderItems.filter((item, index) => index !== indexToRemove);
      setOrderItems(updatedItems);
    } 

    const handleSubmitTransfer = async () => {
      const newTransfer = {info: transferInfo, items: orderItems}
      try {
        await axios
        .post('http://localhost:3000/transfers', newTransfer);
        console.log("submit button pressed");
      } catch (error) {
        console.error('Error updating items:', error);
      }
    };

    return (
      <div>
        <Navbar />
        <div className='topbar'>
          <h1 className="title">New Transfer Form</h1>
        </div>
        <div className='order_table'>
          {/* <button onClick={handleAddItem} className="add-item-button" style={{ backgroundColor: 'blue', color: 'white' }}>Add Item</button> */}
          {labs.length > 0 && (
            <div className='transfer_info'>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h5>Destination</h5>
                <select value={transferInfo.destination} onChange={(e) => handleTransferInfoChange(e.target.value, 'destination')}>
                  <option value="">Select Lab</option>
                  {labs.map(item => (
                    <option key={item.id} value={item.labCode}>
                      {item.labCode}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h5>Date</h5>
                  <input
                    type="date"
                    value={transferInfo.date}
                    onChange={(e) => handleTransferInfoChange(e.target.value, 'date')}
                  />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h5>Recipient</h5>
                  <input
                    type="text"
                    value={transferInfo.recipient}
                    onChange={(e) => handleTransferInfoChange(e.target.value, 'recipient')}
                    style={{ outline: '2px solid black' }}
                  />
              </div>
            </div>
          )}
          {items.length > 0 && (
            <div>
              <select value={x} onChange={handleSelectChange}>
                <option value="">Add Item...</option>
                {items.map(item => (
                  <option key={item.id} value={item.itemName}>
                    {item.itemName}
                  </option>
                ))}
              </select>
              {/* <button onClick={handleAddToOrder}>Add to Order</button> */}
            </div>
          )}
          {orderItems.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((orderItem, index) => (
                  <tr key={index}>
                    <td>{orderItem.name}</td>
                    <td>
                      <input
                        type="number"
                        value={orderItem.quantity}
                        onChange={(e) => handleInputChange(index, 'quantity', Number(e.target.value))}
                      />
                    </td>
                    <td><button onClick={() => {handleDeleteOrderItem(index)}}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button className="submit-button" type="submit" onClick={handleSubmitTransfer}>Submit</button>
        </div>
      </div>
    );
  }
  
  export default NewTransfer;