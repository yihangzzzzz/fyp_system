// const React = require('react');
// const { useState } = React;
// const { Link } = require('react-router-dom');

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { MdInventory2 } from "react-icons/md";
import { FaTruck } from "react-icons/fa";
import { RiFileTransferFill } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";


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
            <div className='navbar-item'>
                <img className='dropdown' src={`${window.location.protocol}//${window.location.hostname}:${window.location.port}/documents/ntu_ccds_logo.png`} alt="Logo" style={{ height: '100%', marginRight: '10px' }} />
            </div>
            <div className='navbar-item'>
              <FaHome />
              <div className="dropdown">
                <Link to={`/home?db=${db}`}style={{fontSize: '16px', padding: '10px'}}>Home</Link>
              </div>
            </div>

            <div className='navbar-item'>
              <MdInventory2/>
              <div className="dropdown">
                <button className="dropbtn">Lab Inventory</button>
                <ul className="dropdown-content">
                    <li><Link to={`/inventory?db=${db}`}>Lab Items Quantity</Link></li>
                    <li><Link to={`/inventory/lowstock?db=${db}`}>Set Low Stock</Link></li>
                    <li><Link to={`/inventory/newitem?db=${db}`}>Add New Item</Link></li>
                </ul>
              </div>
            </div>

            <div className='navbar-item'>
              <FaTruck/>
              <div className="dropdown">
                <button className="dropbtn">PO & Delivery</button>
                <ul className="dropdown-content">
                    <li><Link to={`/orders?db=${db}`}>All PO & Delivery Records</Link></li>
                    <li><Link to={`/orders/neworder?db=${db}`}>Create New PO</Link></li>
                </ul>
              </div>
            </div>

            <div className='navbar-item'>
              <RiFileTransferFill/>
              <div className="dropdown">
                <button className="dropbtn">Transfers</button>
                <ul className="dropdown-content">
                    <li><Link to={`/transfers?db=${db}`}>All Transfer Records</Link></li>
                    <li><Link to={`/transfers/newtransfer?db=${db}`}>Create New Transfer</Link></li>
                </ul>
              </div>
            </div>

            <div className='navbar-item'>
              <IoIosSettings/>
              <div className="dropdown">
                <button className="dropbtn">Settings</button>
                <ul className="dropdown-content">
                    <li><Link to={`/settings/usermanagement?db=${db}`}>User Management</Link></li>
                    <li><Link to={`/settings/emailtemplates?db=${db}`}>Email Templates</Link></li>
                </ul>
              </div>
            </div>
            
        </div>
    );
};


// module.exports = Navbar
export default Navbar;