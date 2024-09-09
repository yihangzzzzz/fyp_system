const React = require('react');
const { useEffect, useState } = React;
const { Link } = require('react-router-dom');
const Navbar = require('../components/navbar');

const Home  = () => {

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
                          <Link to="/inventory">Warehouse Items</Link>
                      </li>
                      <li>
                          <Link to="/inventory/lowstock">Set Low Stock Limit</Link>
                      </li>
                      <li>
                          <Link to="/inventory/newitem">Add New Item</Link>
                      </li>
                    </ul>
                </div>
                <div className="header-section">
                    <h2>Orders</h2>
                    <ul>
                      <li>
                            <Link to="/orders">All Orders</Link>
                      </li>
                      <li>
                            <Link to="/orders/neworder">New Order</Link>
                      </li>
                    </ul>
                </div>
                <div className="header-section">
                    <h2>Transfers</h2>
                    <ul>
                      <li>
                            <Link to="/transfers">All Transfers</Link>
                      </li>
                      <li>
                            <Link to="/transfers/newtransfer">New Transfer</Link>
                      </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  )
}


module.exports = Home 