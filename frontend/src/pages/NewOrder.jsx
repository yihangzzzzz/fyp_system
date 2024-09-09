const React = require('react');
const { useState, useEffect } = React;
const { useNavigate } = require('react-router-dom');
const Navbar = require('../components/navbar');
const axios = require('axios');
const Confirmation = require('../components/confirmation');

const NewOrder = ({}) => {
    const navigate = useNavigate(); 
    const [poDocument, setPoDocument] = useState();
    const [items, setItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [orderInfo, setOrderInfo] = useState({});
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const x = '';
  
    useEffect(() => {
      fetchItems();
    }, []);

    const fetchItems = async () => {
      try {
        await axios
        .get('http://www.iistesting.com:3000/inventory')
        .then((res) => {
            setItems(res.data.recordset);
        })
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
  
    const handleAddOrderInfo = (e, info) => {
      setOrderInfo(prevState => ({
        ...prevState,
        [info]: e  // Replace with the new value for destination
      }));
    }

    const handleAddOrderItem = (event) => {
      setOrderItems([...orderItems, { name: event.target.value, date: new Date().toISOString().split('T')[0], quantity: 0 }]);
    };
  
    const handleEditOrderItem = (index, field, value) => {
      const updatedItems = [...orderItems];
      updatedItems[index][field] = value;
      setOrderItems(updatedItems);
    };

    const handleDeleteOrderItem = (indexToRemove) => {
      const updatedItems = orderItems.filter((item, index) => index !== indexToRemove);
      setOrderItems(updatedItems);
    } 

    const handleSubmitOrder = async () => {

      const newOrder = {poDocument: poDocument, info: orderInfo, items: orderItems}
      console.log(newOrder);

      try {
        await axios
        .post('http://www.iistesting.com:3000/orders/neworder', newOrder, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        
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
        <div className='transfer_info'>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
            <h5>Upload PO Document</h5>
            <input
              type="file"
              name='poDocument'
              accept=".pdf"
              // onChange={(e) => handleAddOrderInfo(e.target.files[0], "pdf")}
              onChange={(e) => setPoDocument(e.target.files[0])}
              style={{ outline: '2px solid black' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h5>PO Number</h5>
              <input
              type="text"
              name="poNumber"
              onChange={(e) => handleAddOrderInfo(e.target.value, "poNumber")}
              style={{ outline: '2px solid black' }}
              />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h5>PO Date</h5>
              <input
              type="date"
              name="poDate"
              onChange={(e) => handleAddOrderInfo(e.target.value, "poDate")}
              style={{ outline: '2px solid black' }}
              />
          </div>
        </div>
          {/* <button onClick={handleAddItem} className="add-item-button" style={{ backgroundColor: 'blue', color: 'white' }}>Add Item</button> */}
          {items.length > 0 && (
            <div>
              <select value={x} onChange={handleAddOrderItem}>
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
                        onChange={(e) => handleEditOrderItem(index, 'date', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={orderItem.quantity}
                        onChange={(e) => handleEditOrderItem(index, 'quantity', Number(e.target.value))}
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
  
module.exports = NewOrder;