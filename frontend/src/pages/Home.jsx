import React, { useEffect, useState, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

Chart.register(...registerables);

const Home = () => {
  const location = useLocation();
  const db = new URLSearchParams(location.search).get("db");
  const [data, setData] = useState([]);
  const canvasRef = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("decoded token is ", decodedToken);
        console.log("current user role is ", decodedToken.role);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      createGraph();
    }
  }, [data]);

  return (
    <div className="home-page">
      <Navbar />
      <div className="home-page-container">
        {db === "sw" ? (
          <h1 className="home-title">Software Project Lab</h1>
        ) : (
          <h1 className="home-title">Hardware Project Lab</h1>
        )}
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
  );
};

export default Home;
