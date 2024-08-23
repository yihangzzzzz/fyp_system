import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import React from 'react'
import Navbar from '../components/navbar'
import axios from 'axios'
import Confirmation from '../components/confirmation'

const NewOrder = ({}) => {
    const navigate = useNavigate(); 
    const [items, setItems] = useState([]);
    // const [selectedItem, setSelectedItem] = useState('');
    const [orderItems, setOrderItems] = useState([]);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const x = '';
  
    useEffect(() => {
      fetchItems();
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
  
    const handleAddItem = () => {
      fetchItems();
    };
  
    const handleSelectChange = (event) => {
      // setSelectedItem(event.target.value);
      const today = new Date().toISOString().split('T')[0];
      setOrderItems([...orderItems, { name: event.target.value, date: today, quantity: 0 }]);
      // setSelectedItem(''); // Clear the selection after adding
    };
  
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

    const handleSubmitOrder = async () => {

      try {
        await axios
        .post('http://localhost:3000/orders', orderItems)
        
      } catch (error) {
        console.error('Error updating items:', error);
      }
      navigate('/orders');
      
    };


    return (
      <div>
        <Navbar />
        <div className='topbar'>
          <h1 className="title">Order Form</h1>
        </div>
        <div className='order_table'>
          {/* <button onClick={handleAddItem} className="add-item-button" style={{ backgroundColor: 'blue', color: 'white' }}>Add Item</button> */}
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
                  <th>Date</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((orderItem, index) => (
                  <tr key={index}>
                    <td>{orderItem.name}</td>
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
                        onChange={(e) => handleInputChange(index, 'quantity', Number(e.target.value))}
                      />
                    </td>
                    <td><button onClick={() => {handleDeleteOrderItem(index)}}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* <button className="submit-button" type="submit" onClick={handleSubmitOrder}>Submit</button> */}
          <button className="submit-button" type="submit" onClick={() => setIsConfirmationOpen(true)}>Submit</button>
        </div>
        <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleSubmitOrder}/>
      </div>
    );
  }
  
  export default NewOrder;