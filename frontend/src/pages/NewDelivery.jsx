const React = require('react');
const { useState, useEffect } = React;
const { useNavigate, useLocation } = require('react-router-dom');
const Navbar = require('../components/navbar');
const axios = require('axios');
const Confirmation = require('../components/confirmation');



const NewDelivery = () => {

    const location = useLocation();
    // const { data } = props.location.state;
    const items = location.state || {};

    useEffect(() => {
        console.log(items);
    }, []);

  return (
    <div>
        <Navbar />
        <div className='topbar'>
          <h1 className="title">New Delivery</h1>
        </div>
        <div className='order_table'>
        <div className='transfer_info'>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
            <h5>Upload DO Document</h5>
            <input
              type="file"
              name='doDocument'
              accept=".pdf"
              // onChange={(e) => handleAddOrderInfo(e.target.files[0], "pdf")}
              // onChange={(e) => setPoDocument(e.target.files[0])}
            //   onChange={(e) => handleAddPODocument(e.target.files[0])}
              style={{ outline: '2px solid black' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h5>DO Number</h5>
              <input
              type="text"
              name="doNumber"
            //   value={orderInfo.poNumber}
            //   onChange={(e) => handleAddOrderInfo(e.target.value, "poNumber")}
              style={{ outline: '2px solid black' }}
              />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h5>DO Date</h5>
              <input
              type="date"
              name="doDate"
            //   value={orderInfo.poDate}
            //   onChange={(e) => handleAddOrderInfo(e.target.value, "poDate")}
              style={{ outline: '2px solid black' }}
              />
          </div>
        </div>
        <div>
            {items.name.map((item, index) => {
                return(<h1>{item.itemName}</h1>)
            })}
        </div>
        </div>
    </div>
  )
}
module.exports = NewDelivery