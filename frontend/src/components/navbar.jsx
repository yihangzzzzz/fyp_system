// const React = require('react');
// const { useState } = React;
// const { Link } = require('react-router-dom');

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const Navbar = () => {
  const location = useLocation();
  const db = new URLSearchParams(location.search).get('db');

  const [isOpen, setIsOpen] = useState({inventory: false, order: false, transfer: false}); // State to track dropdown visibility

  const toggleDropdown = (type) => {
    setIsOpen(prevState => ({
      ...prevState,
      [type]: !prevState[type]  // Replace with the new value for destination
    }));
  };

    return (
      <div className='navbar'>
            <div className="dropdown">
              <Link to={`/home?db=${db}`}style={{fontSize: '16px', padding: '10px'}}>Home</Link>
            </div>
            <div className="dropdown">
                <button className="dropbtn">Inventory</button>
                <ul className="dropdown-content">
                    <li><Link to={`/inventory?db=${db}`}>Items</Link></li>
                    <li><Link to={`/inventory/lowstock?db=${db}`}>Low Stock</Link></li>
                    <li><Link to={`/inventory/newitem?db=${db}`}>New Item</Link></li>
                </ul>
            </div>

            <div className="dropdown">
                <button className="dropbtn">Orders</button>
                <ul className="dropdown-content">
                    <li><Link to={`/orders?db=${db}`}>Current Orders</Link></li>
                    <li><Link to={`/orders/neworder?db=${db}`}>New Order</Link></li>
                </ul>
            </div>

            <div className="dropdown">
                <button className="dropbtn">Transfers</button>
                <ul className="dropdown-content">
                    <li><Link to={`/transfers?db=${db}`}>All Transfers</Link></li>
                    <li><Link to={`/transfers/newtransfer?db=${db}`}>New Transfer</Link></li>
                </ul>
            </div>
            <div className="dropdown">
              <Link to={`/users?db=${db}`} style={{fontSize: '16px', padding: '10px'}}>Users</Link>
            </div>
        </div>
    );
};


// module.exports = Navbar
export default Navbar;