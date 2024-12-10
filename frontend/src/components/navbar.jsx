// const React = require('react');
// const { useState } = React;
// const { Link } = require('react-router-dom');

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdInventory2 } from "react-icons/md";
import { FaTruck } from "react-icons/fa";
import { RiFileTransferFill } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import Confirmation from "../components/confirmation.jsx";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineAttachEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Navbar = () => {
  const location = useLocation();
  const db = new URLSearchParams(location.search).get("db");
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState({
    inventory: false,
    order: false,
    transfer: false,
  }); // State to track dropdown visibility
  const [currentUser, setCurrentUser] = useState();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setCurrentUser(decodedToken.username);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, [location.search]);

  const logoutUser = () => {
    localStorage.removeItem("token");
    navigate(`/login?db=${db}`);
  };

  const toggleDropdown = (type) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [type]: !prevState[type], // Replace with the new value for destination
    }));
  };

  return (
    <div className="navbar">
      <div className="navbar_logo">
        <img
          className="navbar_picture"
          src={`${window.location.protocol}//${window.location.hostname}:${window.location.port}/documents/ntu_ccds_logo_final.png`}
          alt="Logo"
        />
      </div>
      <div className="navbar-item">
        <FaHome />
        <div className="dropdown">
          <Link
            to={`/home?db=${db}`}
            style={{ fontSize: "16px", padding: "10px" }}
          >
            Home
          </Link>
        </div>
      </div>

      <div className="navbar-item">
        <MdInventory2 />
        <div className="dropdown">
          <button className="dropbtn">Lab Inventory</button>
          <ul className="dropdown-content">
            <li>
              <Link to={`/inventory?db=${db}`}>Lab Items Quantity</Link>
            </li>
            <li>
              <Link to={`/inventory/lowstock?db=${db}`}>Set Low Stock</Link>
            </li>
            <li>
              <Link to={`/inventory/newitem?db=${db}`}>Add New Item</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="navbar-item">
        <FaTruck />
        <div className="dropdown">
          <button className="dropbtn">PO & Delivery</button>
          <ul className="dropdown-content">
            <li>
              <Link to={`/orders?db=${db}`}>All PO & Delivery Records</Link>
            </li>
            <li>
              <Link to={`/orders/neworder?db=${db}`}>Create New PO</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="navbar-item">
        <RiFileTransferFill />
        <div className="dropdown">
          <button className="dropbtn">Transfers</button>
          <ul className="dropdown-content">
            <li>
              <Link to={`/transfers?db=${db}`}>All Transfer Records</Link>
            </li>
            <li>
              <Link to={`/transfers/newtransfer?db=${db}`}>
                Create New Transfer
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="navbar-item">
        <FaUser />
        <div className="dropdown">
          <Link
            to={`/settings/usermanagement?db=${db}`}
            style={{ fontSize: "16px", padding: "10px" }}
          >
            User Management
          </Link>
        </div>
      </div>

      <div className="navbar-item">
        <MdEmail />
        <div className="dropdown">
          <Link
            to={`/settings/emailtemplates?db=${db}`}
            style={{ fontSize: "16px", padding: "10px" }}
          >
            Email Templates
          </Link>
        </div>
      </div>

      <div className="navbar_logout">
        <FaRegUserCircle />
        <h5>{currentUser}</h5>
        <button
          onClick={() => {
            setIsConfirmationOpen(true);
          }}
          className="logout_button"
          style={{ color: "red" }}
        >
          Logout
        </button>
      </div>

      <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={logoutUser}
        message={"Confirm to logout?"}
      />
    </div>
  );
};

// module.exports = Navbar
export default Navbar;
