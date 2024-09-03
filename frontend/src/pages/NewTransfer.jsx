import { useState, useEffect} from 'react'
import React from 'react'
import Navbar from '../components/navbar'
import axios from 'axios'
import Confirmation from '../components/confirmation'
import { useNavigate } from 'react-router-dom';

const NewTransfer = ({}) => {
    const navigate = useNavigate(); 
    const [items, setItems] = useState([]);
    const [labs, setLabs] = useState([]);
    const [transferItems, setTransferItems] = useState([]);
    const [transferInfo, setTransferInfo] = useState({destination: '', date: new Date().toISOString().split('T')[0], recipient: '', email: '', status: '' });
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
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
  
    const handleAddTransferItem = (event) => {
      setTransferItems([...transferItems, { name: event.target.value, quantity: 0 }]);
    };

    const handleTransferInfoChange = (e, info) => {
      setTransferInfo(prevState => ({
        ...prevState,
        [info]: e  // Replace with the new value for destination
      }));
    }
  
    const handleInputChange = (index, field, value) => {
      const updatedItems = [...transferItems];
      updatedItems[index][field] = value;
      setTransferItems(updatedItems);
    }

    const handleDeleteOrderItem = (indexToRemove) => {
      const updatedItems = transferItems.filter((item, index) => index !== indexToRemove);
      setTransferItems(updatedItems);
    } 

    const handleSubmitTransfer = async () => {
      const newTransfer = {info: transferInfo, items: transferItems}
      let transferID, transferType;

      try {
        await axios
        .post('http://localhost:3000/transfers/newtransfer', newTransfer)
        .then((res) => {
          transferID = res.data.recordset[0].transferID
        });
      } catch (error) {
        console.error('Error updating items:', error);
      }

      try {
        await axios
        .post(`http://localhost:3000/transfers/newtransfer/additems?transferID=${encodeURIComponent(transferID)}`, transferItems)
      } catch (error) {
        console.error('Error updating items:', error);
      }

      try {
        if (transferInfo.destination.includes('Counter')) {
          await axios
          .put(`http://localhost:3000/transfers/updateinventory?type=counter`, transferItems)
        }
        else if (transferInfo.destination.includes('Cabinet')) {
          await axios
          .put(`http://localhost:3000/transfers/updateinventory?type=cabinet`, transferItems)
        }
        
      } catch (error) {
        console.error('Error updating items:', error);
      }

      navigate('/transfers');
    }
      
  

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
              {!(transferInfo.destination.includes('Counter') || transferInfo.destination.includes('Cabinet')) && (
                <div className='transfer_info'>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h5>Recipient</h5>
                    <input
                      type="text"
                      value={transferInfo.recipient}
                      onChange={(e) => handleTransferInfoChange(e.target.value, 'recipient')}
                      style={{ outline: '2px solid black' }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h5>Email</h5>
                    <input
                      type="text"
                      value={transferInfo.email}
                      onChange={(e) => handleTransferInfoChange(e.target.value, 'email')}
                      style={{ outline: '2px solid black' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {items.length > 0 && (
            <div>
              <select value={x} onChange={handleAddTransferItem}>
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
          {transferItems.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity to Transfer</th>
                </tr>
              </thead>
              <tbody>
                {transferItems.map((orderItem, index) => (
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
          <button className="submit-button" type="submit" onClick={() => {setIsConfirmationOpen(true)}}>Submit</button>
        </div>
        <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleSubmitTransfer}/>
      </div>
    );
}
  
  
  export default NewTransfer;