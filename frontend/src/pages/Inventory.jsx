import axios from "axios";
import React, { useEffect, useState } from "react";
import Actions from "../components/actions.jsx";
import Navbar from "../components/navbar.jsx";
import { DownloadTable } from "../functions/downloadTable.jsx";
import { useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";

const Inventory = () => {
  const { search } = useLocation();
  const db = new URLSearchParams(location.search).get("db");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortQuery, setSortQuery] = useState("");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [filterQuery, setFilterQuery] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, [search]);

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
    setSortQuery("");
    fetchInventory();
  };

  const handleSetFilters = (field, value) => {
    setFilterQuery((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const filteredInventory = inventory
    .filter((item) => {
      return (
        (!filterQuery.itemName ||
          item.itemName
            .toLowerCase()
            .includes(filterQuery.itemName.toLowerCase())) &&
        (!filterQuery.lowStock || item.cabinet < item.lowStock)
      );
    })

    .sort((a, b) => {
      if (sortQuery === "name") {
        return a.itemName.localeCompare(b.itemName);
      } else if (sortQuery === "cabinet") {
        return a.cabinet - b.cabinet;
      } else return;
    });

  const printTableToPDF = () => {
    DownloadTable("table-to-print", "Inventory Report");
  };

  return (
    <div>
      <Navbar />
      <div className="topbar">
        <h1 className="title">Inventory</h1>
        <div className="search-container">
          <input
            type="text"
            name="itemName"
            className="search-input"
            placeholder="Search for item"
            value={filterQuery.itemName || ""}
            onChange={(e) => handleSetFilters(e.target.name, e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
        <button
          className="print-button"
          onClick={() => {
            DownloadTable("table-to-print", "Inventory Report");
          }}
        >
          Print Table as PDF
        </button>
      </div>

      <div className="inventory_table">
        <div className="filter-table">
          <div className="filter-header">
            <div
              className="filter-child-element"
              onClick={() => {
                setShowFilters(!showFilters);
                setShowSort(false);
              }}
              style={{ cursor: "pointer" }}
            >
              <h4>Filters</h4>
              <FaFilter />
            </div>

            <div className="filter-child-element">
              <button
                title="Reset"
                className="clear-filters-button"
                onClick={() => {
                  setFilterQuery({});
                  setSortQuery({});
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="inputs">
              <div className="input-field">
                <h5>Low Stock</h5>
                <input
                  type="checkbox"
                  name="lowStock"
                  checked={filterQuery.lowStock || false}
                  onChange={(e) =>
                    handleSetFilters(e.target.name, e.target.checked)
                  }
                />
              </div>
            </div>
          )}
        </div>
        <div className="items-table">
          <table className="inventory-table-main" id="table-to-print">
            <thead class>
              <tr className="table-header-row">
                <th className="table-header-title">Picture</th>
                <th className="table-header-title">Item Name</th>
                <th className="table-header-title">Description</th>
                <th className="table-header-title">Cabinet</th>
                <th className="table-header-title">Counter</th>
                <th className="table-header-title">Total</th>
                <th className="table-header-title">
                  Ordered
                  <br />
                  Pending Delivery
                </th>
                <th className="table-header-title">Lost/Damaged</th>
                <th className="table-header-title">Remarks</th>
                <th className="table-header-title">Actions</th>
              </tr>
            </thead>
            <tbody className="inventory-table-body">
              {filteredInventory.map((item, index) => (
                <tr key={index}>
                  <td className="image_cell">
                    {" "}
                    <img
                      className="inventory_image"
                      src={
                        `${window.location.protocol}//${window.location.hostname}:${window.location.port}/documents/${db}/itemPictures/` +
                        item.picture
                      }
                    />
                  </td>
                  <td>{item.itemName}</td>
                  <td>{item.description}</td>
                  <td>{item.cabinet}</td>
                  <td>{item.counter}</td>
                  {item.counter + item.cabinet < item.lowStock ? (
                    <td style={{ backgroundColor: "#f85a68 ", color: "white" }}>
                      {item.counter + item.cabinet}
                    </td>
                  ) : (
                    <td>{item.counter + item.cabinet}</td>
                  )}
                  <td>{item.ordered}</td>
                  <td>{item.lostDamaged}</td>
                  <td>{item.remarks}</td>
                  <td>
                    {editingOrderId === index ? (
                      <h1>pls</h1>
                    ) : (
                      <Actions
                        toDelete={item.itemID}
                        toEdit={item.itemID}
                        toTransfer={item.itemID}
                        mode={"inventory"}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
