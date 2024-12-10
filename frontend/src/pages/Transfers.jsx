import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar.jsx";
import Confirmation from "../components/confirmation.jsx";
import { useNavigate } from "react-router-dom";
import { DownloadTable } from "../functions/downloadTable.jsx";
import { useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";

const Transfers = () => {
  const { search } = useLocation();
  const db = new URLSearchParams(location.search).get("db");
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [inventoryInbound, setInventoryInbound] = useState([]);
  const [inventoryOutbound, setInventoryOutbound] = useState([]);
  const [inventoryMiscellaneous, setInventoryMiscellaneous] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [statusChange, setStautsChange] = useState({
    status: "",
    id: null,
    type: "",
  });
  const [filterQuery, setFilterQuery] = useState({ itemName: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMode, setSelectedMode] = useState("All");
  const [showSort, setShowSort] = useState(false);
  const [labs, setLabs] = useState([]);

  useEffect(() => {
    fetchInventory();
    fetchLabs();
  }, [search]);

  const fetchInventory = async (sortAtt) => {
    await axios
      .get(
        `${window.location.protocol}//${window.location.hostname}:${window.location.port}/transfers_be?db=${db}`,
        { params: { sortBy: sortAtt } }
      )
      .then((res) => {
        setInventoryInbound(res.data.inbound);
        setInventoryOutbound(res.data.outbound);
        setInventoryMiscellaneous(res.data.miscellaneous);
        setInventory([
          ...res.data.inbound,
          ...res.data.outbound,
          ...res.data.miscellaneous,
        ]);
      })
      .catch((error) => {
        console.log("le error is " + error);
      });
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleReset = () => {
    setSearchQuery("");
    fetchInventory();
  };

  const handleTransferStatusChange = async () => {
    setIsConfirmationOpen(false);
    await axios.put(
      `${window.location.protocol}//${window.location.hostname}:${window.location.port}/transfers_be/manualstatuschange?db=${db}`,
      statusChange
    );
    setStautsChange({ status: "", id: null, type: "" });
    fetchInventory();
  };

  const handleSetFilters = (field, value) => {
    setFilterQuery((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const fetchLabs = async () => {
    try {
      await axios
        .get(
          `${window.location.protocol}//${window.location.hostname}:${window.location.port}/transfers_be/labs?db=${db}`
        )
        .then((res) => {
          setLabs(res.data.recordset);
        });
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    return (
      (!filterQuery.destination ||
        item.destination
          .toLowerCase()
          .includes(filterQuery.destination.toLowerCase())) &&
      (!filterQuery.type || item.type.includes(filterQuery.type)) &&
      (!filterQuery.transferStartDate ||
        new Date(item.date) >= new Date(filterQuery.transferStartDate)) &&
      (!filterQuery.transferEndDate ||
        new Date(item.date) <= new Date(filterQuery.transferEndDate)) &&
      (!filterQuery.recipient ||
        item.recipient
          .toLowerCase()
          .includes(filterQuery.recipient.toLowerCase())) &&
      (!filterQuery.status || item.status.includes(filterQuery.status)) &&
      item.items.some((itemDetail) => {
        if (filterQuery.itemName) {
          const itemName = itemDetail.itemName;
          return itemName
            .toLowerCase()
            .includes(filterQuery.itemName.toLowerCase());
        } else {
          return true;
        }
      })
    );
  });

  return (
    <div>
      <Navbar />
      <div className="topbar">
        <h1 className="title">Transfer Records</h1>
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
            DownloadTable("table-to-print", "Transfer Records Report");
          }}
        >
          Print Table as PDF
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
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
                    setFilterQuery({ itemName: "" });
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
                  <h5>Type</h5>
                  <select
                    name="type"
                    value={filterQuery.type || ""}
                    onChange={(e) =>
                      handleSetFilters(e.target.name, e.target.value)
                    }
                  >
                    <option value="">Select Type</option>
                    <option value="Transfer Out">Transfer Out</option>
                    <option value="Transfer In">Transfer In</option>
                    <option value="Loan">Loan</option>
                    <option value="Miscellaneous">
                      Cabinet,Counter,Lost/Damaged
                    </option>
                  </select>
                </div>
                <div className="input-field">
                  <h5>Destination/Source</h5>
                  <select
                    name="destination"
                    value={filterQuery.destination || ""}
                    onChange={(e) =>
                      handleSetFilters(e.target.name, e.target.value)
                    }
                  >
                    <option value="">Select Type</option>
                    {labs.map((lab) => (
                      <option value={lab.labCode}>{lab.labCode}</option>
                    ))}
                  </select>
                </div>

                <div className="input-field">
                  <h5>Transfer Date</h5>
                  <div className="date-range-inputs">
                    <input
                      type="date"
                      name="transferStartDate"
                      value={filterQuery.transferStartDate || ""}
                      onChange={(e) =>
                        handleSetFilters(e.target.name, e.target.value)
                      }
                    />
                    <h5>to</h5>
                    <input
                      type="date"
                      name="transferEndDate"
                      value={filterQuery.transferEndDate || ""}
                      onChange={(e) =>
                        handleSetFilters(e.target.name, e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="input-field">
                  <h5>Recipient</h5>
                  <input
                    type="text"
                    name="recipient"
                    value={filterQuery.recipient || ""}
                    onChange={(e) =>
                      handleSetFilters(e.target.name, e.target.value)
                    }
                  />
                </div>
                <div className="input-field">
                  <h5>Status</h5>
                  <select
                    name="status"
                    value={filterQuery.status || ""}
                    onChange={(e) =>
                      handleSetFilters(e.target.name, e.target.value)
                    }
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Acknowledged">Acknowledged</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="On Loan">On Loan</option>
                    <option value="Returned">Returned</option>
                  </select>
                </div>
              </div>
            )}
            {showSort && (
              <div className="inputs">
                <div className="input-field">
                  <select
                    onChange={(e) => {
                      fetchInventory(e.target.value);
                    }}
                    className="sortDropdown"
                  >
                    <option value="">Sort by...</option>
                    <option value="name">Item Name</option>
                    <option value="quantity">Quantity</option>
                    <option value="date">Date</option>
                    <option value="destination">Destination</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="transfer-main-table">
            <div className="transfer-tables-mode">
              <button
                className={`transfer-table-mode-button ${
                  selectedMode === "Inbound" ? "selected" : ""
                }`}
                onClick={() => {
                  setInventory(inventoryInbound);
                  setSelectedMode("Inbound");
                }}
              >
                Incoming
              </button>
              <button
                className={`transfer-table-mode-button ${
                  selectedMode === "Outbound" ? "selected" : ""
                }`}
                onClick={() => {
                  setInventory(inventoryOutbound);
                  setSelectedMode("Outbound");
                }}
              >
                Outgoing
              </button>
              <button
                className={`transfer-table-mode-button ${
                  selectedMode === "Miscellaneous" ? "selected" : ""
                }`}
                onClick={() => {
                  setInventory(inventoryMiscellaneous);
                  setSelectedMode("Miscellaneous");
                }}
              >
                Cabinet,Counter,Lost/Damaged
              </button>
              <button
                className={`transfer-table-mode-button ${
                  selectedMode === "All" ? "selected" : ""
                }`}
                onClick={() => {
                  setInventory([
                    ...inventoryInbound,
                    ...inventoryOutbound,
                    ...inventoryMiscellaneous,
                  ]);
                  setSelectedMode("All");
                }}
              >
                All
              </button>
            </div>
            <div className="inventory-table-container">
              <table className="inventory-table" id="table-to-print">
                <thead>
                  <tr className="table-header-row">
                    <th className="table-header-title">Type</th>
                    <th className="table-header-title">Source</th>
                    <th className="table-header-title">Destination</th>
                    <th className="table-header-title">Date</th>
                    <th className="table-header-title">From</th>
                    <th className="table-header-title">Recipient</th>
                    <th className="table-header-title">Email</th>
                    <th className="table-header-title">
                      Transfer<br></br>Form
                    </th>
                    <th className="table-header-title">Status</th>
                    <th className="table-header-title">Items</th>
                    <th className="table-header-title">Quantity</th>
                    <th className="table-header-title">Remarks</th>
                  </tr>
                </thead>
                <tbody className="inventory-table-body">
                  {filteredInventory.map((item, index) => {
                    const itemsArray = item.items;
                    const rowSpan = itemsArray.length;
                    const date = new Date(item.date);
                    const formattedDate = `${String(date.getDate()).padStart(
                      2,
                      "0"
                    )}/${String(date.getMonth() + 1).padStart(
                      2,
                      "0"
                    )}/${date.getFullYear()}`;

                    return (
                      <>
                        {itemsArray.map((itemDetail, idx) => (
                          <tr key={`${index}-${idx}`}>
                            {idx === 0 && (
                              <>
                                <td rowSpan={rowSpan}>
                                  {item.type === "Miscellaneous" ? (
                                    <>
                                      Cabinet,Counter,
                                      <>
                                        <br />
                                      </>
                                      Lost/Damaged
                                    </>
                                  ) : (
                                    <>{item.type}</>
                                  )}
                                </td>
                                <td rowSpan={rowSpan}>{item.source}</td>
                                <td rowSpan={rowSpan}>{item.destination}</td>
                                <td rowSpan={rowSpan}>{formattedDate}</td>
                                <td rowSpan={rowSpan}>{item.sender}</td>
                                <td rowSpan={rowSpan}>{item.recipient}</td>
                                <td rowSpan={rowSpan}>{item.email}</td>
                                <td rowSpan={rowSpan}>
                                  <a
                                    href={`/transfers_be/pdf/${item.transferDocument}?db=${db}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {item.transferID}
                                  </a>
                                </td>

                                <td rowSpan={rowSpan}>
                                  <select
                                    disabled={
                                      item.status === "Acknowledged" ||
                                      item.status === "Returned"
                                    }
                                    value={item.status}
                                    onChange={(e) => {
                                      setStautsChange({
                                        status: e.target.value,
                                        id: item.transferID,
                                        type: item.type,
                                      });
                                      setIsConfirmationOpen(true);
                                    }}
                                    style={{
                                      color:
                                        item.status === "Pending"
                                          ? "#FF922C"
                                          : item.status === "Acknowledged" ||
                                            item.status === "Returned"
                                          ? "#238823"
                                          : item.status === "Cancelled"
                                          ? "#D2222D"
                                          : item.status === "On Loan"
                                          ? "#1E90FF"
                                          : "black",
                                    }}
                                  >
                                    {item.type === "Loan" ? (
                                      <>
                                        <option
                                          style={{ color: "black" }}
                                          value="Pending"
                                        >
                                          Pending
                                        </option>
                                        <option
                                          style={{ color: "black" }}
                                          value="On Loan"
                                        >
                                          On Loan
                                        </option>
                                        <option
                                          style={{ color: "black" }}
                                          value="Returned"
                                        >
                                          Returned
                                        </option>
                                      </>
                                    ) : (
                                      <>
                                        <option
                                          style={{ color: "black" }}
                                          value="Pending"
                                        >
                                          Pending
                                        </option>
                                        <option
                                          style={{ color: "black" }}
                                          value="Acknowledged"
                                        >
                                          Acknowledged
                                        </option>
                                        <option
                                          style={{ color: "black" }}
                                          value="Cancelled"
                                        >
                                          Cancelled
                                        </option>
                                      </>
                                    )}
                                  </select>
                                </td>
                              </>
                            )}
                            <td
                              className={`transfer-table-item ${
                                filterQuery.itemName != "" &&
                                itemDetail.itemName
                                  .toLowerCase()
                                  .includes(filterQuery.itemName.toLowerCase())
                                  ? "selected"
                                  : ""
                              }`}
                            >
                              {itemDetail.itemName}
                            </td>
                            <td
                              className={`transfer-table-item ${
                                filterQuery.itemName != "" &&
                                itemDetail.itemName
                                  .toLowerCase()
                                  .includes(filterQuery.itemName.toLowerCase())
                                  ? "selected"
                                  : ""
                              }`}
                            >
                              {itemDetail.quantity}
                            </td>
                            {idx === 0 && (
                              <td rowSpan={rowSpan}>{item.remarks}</td>
                            )}
                          </tr>
                        ))}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleTransferStatusChange}
        message={"Confirm to Change transfer status?"}
      />
    </div>
  );
};

export default Transfers;
