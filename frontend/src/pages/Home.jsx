// const React = require('react');
// const { useEffect, useState } = React;
// const { Link } = require('react-router-dom');
// const Navbar = require('../components/navbar');

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import { useLocation } from 'react-router-dom';


const Home  = () => {

  const location = useLocation();
  const db = new URLSearchParams(location.search).get('db');

  return (
    <div className='home-page'>
        <Navbar />
        <div className="home-page-container">
            <h1 className="home-title">Inventory Management System</h1>
            <div className="header-container">
                <div className="header-section">
                    <h2>Inventory</h2>
                    <ul>
                      <li>
                          <Link to={`/inventory?db=${db}`}>Warehouse Items</Link>
                      </li>
                      <li>
                          <Link to={`/inventory/lowstock?db=${db}`}>Low Stock</Link>
                      </li>
                      <li>
                          <Link to={`/inventory/newitem?db=${db}`}>New Item</Link>
                      </li>
                    </ul>
                </div>
                <div className="header-section">
                    <h2>Orders</h2>
                    <ul>
                      <li>
                          <Link to={`/orders?db=${db}`}>Current Orders</Link>
                      </li>
                      <li>
                          <Link to={`/orders/neworder?db=${db}`}>New Order</Link>
                      </li>
                    </ul>
                </div>
                <div className="header-section">
                    <h2>Transfers</h2>
                    <ul>
                      <li>
                          <Link to={`/transfers?db=${db}`}>All Transfers</Link>
                      </li>
                      <li>
                          <Link to={`/transfers/newtransfer?db=${db}`}>New Transfer</Link>
                      </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  )
}


// module.exports = Home 
export default Home;