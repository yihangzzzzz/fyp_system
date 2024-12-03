import axios from "axios";
import React, { useEffect, useState } from "react";

import Navbar from "../components/navbar.jsx";
import { useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const LowStock = () => {
  const location = useLocation();
  const db = new URLSearchParams(location.search).get("db");

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async (sortAtt) => {
    await axios
      .get(
        `${window.location.protocol}//${window.location.hostname}:${window.location.port}/inventory_be?db=${db}`,
        { params: { sortBy: sortAtt } }
      )
      .then((res) => {
        setInventory(res.data.recordset);
        setLoading(false);
      })
      .catch((error) => {
        console.log("le error is " + error);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleReset = () => {
    setSearchQuery("");
    fetchInventory();
  };

  const filteredInventory = inventory.filter((item) =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLowStockChange = async (itemID, newLowStock) => {
    await axios.put(
      `${window.location.protocol}//${window.location.hostname}:${window.location.port}/inventory_be/lowstock?db=${db}`,
      { itemID: itemID, newLowStock: newLowStock }
    );
    fetchInventory();
  };

  return (
    <div>
      <Navbar />
      <div className="topbar">
        <h1 className="title">Set Low Stock Limit</h1>
        <div className="search-container">
          <input
            type="text"
            name="itemName"
            className="search-input"
            placeholder="Search for item"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="inventory_table">
          <table>
            <thead>
              <tr>
                <th
                  className="table-header-title"
                  style={{ fontWeight: "bold" }}
                >
                  Item Name
                </th>
                <th
                  className="table-header-title"
                  style={{ fontWeight: "bold" }}
                >
                  Currrent Quantity
                </th>
                <th
                  className="table-header-title"
                  style={{ fontWeight: "bold" }}
                >
                  Low Stock Limit
                </th>
              </tr>
            </thead>
            <tbody className="inventory-table-body">
              {filteredInventory.map((item, index) => (
                <tr key={index}>
                  <td>{item.itemName}</td>
                  <td>{item.cabinet + item.counter}</td>
                  <td>
                    <input
                      type="number"
                      value={item.lowStock ?? 0}
                      onChange={(e) =>
                        handleLowStockChange(
                          item.itemID,
                          e.target.value === "" ? 0 : e.target.value
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LowStock;
