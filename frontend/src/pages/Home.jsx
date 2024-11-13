// const React = require('react');
// const { useEffect, useState } = React;
// const { Link } = require('react-router-dom');
// const Navbar = require('../components/navbar');

import React, { useEffect, useState, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { RiH1 } from 'react-icons/ri';
import { jwtDecode }from 'jwt-decode';

Chart.register(...registerables);

const Home  = () => {

    const location = useLocation();
    const db = new URLSearchParams(location.search).get('db');
    const [data, setData] = useState([]);
    const canvasRef = useRef(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // const getRandomColor = () => {
    //     const letters = '0123456789ABCDEF';
    //     let color = '#';
    //     for (let i = 0; i < 6; i++) {
    //         color += letters[Math.floor(Math.random() * 16)];
    //     }
    //     return color;
    // };

    // const fetchTransferGraphData = async () => {
    //     await axios
    //     .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/transfers_be/transfergraph?db=${db}`)
    //     .then((res) => {
    //         const formattedData = res.data.recordset.map(item => ({
    //             ...item,
    //             date: formatDate(item.date),
    //         }));
    //         setData(formattedData);
    //     })
    //     .catch((error) => {
    //         console.log("le error is " + error);
    //         setLoading(false);
    //     });


    // }

    // const createGraph = async () => {
    //     const groupedData = {};

    //     data.forEach(({ itemName, date, quantity }) => {
    //         if (!groupedData[itemName]) {
    //             groupedData[itemName] = {};
    //         }
    //         groupedData[itemName][date] = (groupedData[itemName][date] || 0) + quantity;
    //     });

        

    //     const labels = [...new Set(data.map(item => item.date))].sort();
    //     const datasets = Object.keys(groupedData).map(itemName => {
    //         return {
    //             label: itemName,
    //             data: labels.map(date => groupedData[itemName][date] || 0),
    //             borderColor: getRandomColor(),
    //             fill: false,
    //         };
    //     });

    //     const ctx = canvasRef.current.getContext('2d');

    //     new Chart(ctx, {
    //         type: 'line',
    //         data: {
    //             labels: labels,
    //             datasets: datasets,
    //         },
    //         options: {
    //             scales: {
    //                 x: {
    //                     type: 'category',
    //                     title: {
    //                         display: true,
    //                         text: 'Date',
    //                     },
    //                 },
    //                 y: {
    //                     title: {
    //                         display: true,
    //                         text: 'Quantity',
    //                     },
    //                 },
    //             },
    //             responsive: true,
    //             plugins: {
    //                 legend: {
    //                     display: true,
    //                     position: 'top',
    //                 },
    //             },
    //         },
    //     });
    // }

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
              // Decode JWT to get user role
              const decodedToken = jwtDecode(token);
              console.log("decoded token is ", decodedToken)
              console.log("current user role is ", decodedToken.role); // userRole could be 'admin', 'user', 'guest', etc.
            } catch (err) {
              console.error('Failed to decode token:', err);
            }
          }

    }, []);

    useEffect(() => {
        if (data.length > 0) {
            createGraph(); // Call createGraph when data is updated
        }
    }, [data]); // Runs when `data` changes













  return (
    <div className='home-page'>
        <Navbar />
        <div className="home-page-container">
            {db === 'sw' ? (<h1 className="home-title">Software Project Lab</h1>) : (<h1 className="home-title">Hardware Project Lab</h1>)}
            {/* <h1 className="home-title">Inventory Management System</h1> */}
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

        {/* <div className='line_graphs'>
                <h2>Line Graph</h2>
                <div>
                    <canvas className='transfer_graph' ref={canvasRef}></canvas>
                </div>
        </div> */}

    </div>
  )
}


// module.exports = Home 
export default Home;