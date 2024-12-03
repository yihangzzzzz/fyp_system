import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar.jsx";
import Confirmation from "../components/confirmation.jsx";
import { useNavigate } from "react-router-dom";
import { DownloadTable } from "../functions/downloadTable.jsx";
import { useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";

const Orders = () => {
  const location = useLocation();
  const db = new URLSearchParams(location.search).get("db");
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortQuery, setSortQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState({});
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isCancelConfirmationOpen, setIsCancelConfirmationOpen] =
    useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sendFinance, setSendFinance] = useState({});

  useEffect(() => {
    fetchInventory();
  }, [location.search]);

  const fetchInventory = async (sortAtt) => {
    await axios
      .get(
        `${window.location.protocol}//${window.location.hostname}:${window.location.port}/orders_be?db=${db}`,
        { params: { sortBy: sortAtt } }
      )
      .then((res) => {
        setInventory(res.data);
        console.log("orders are ", res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("le error is " + error);
        setLoading(false);
      });
  };

  const fetchInventorySort = async (direction) => {
    await axios.get(
      `${window.location.protocol}//${window.location.hostname}:${window.location.port}/orders_be?db=${db}`,
      { params: { sortBy: sortAtt } }
    );
  };

  const handleReset = () => {
    setSearchQuery("");
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
        (!filterQuery.poStartDate ||
          new Date(item.poDate) >= new Date(filterQuery.poStartDate)) &&
        (!filterQuery.poEndDate ||
          new Date(item.poDate) <= new Date(filterQuery.poEndDate)) &&
        (!filterQuery.poNumber ||
          item.poNumber.includes(filterQuery.poNumber)) &&
        (!filterQuery.status || item.status.includes(filterQuery.status)) &&
        item.items.some((itemDetail) => {
          if (filterQuery.doStartDate) {
            return (
              new Date(itemDetail.doDate) >= new Date(filterQuery.doStartDate)
            );
          } else {
            return true;
          }
        }) &&
        item.items.some((itemDetail) => {
          if (filterQuery.doEndDate) {
            return (
              new Date(itemDetail.doDate) <= new Date(filterQuery.doEndDate)
            );
          } else {
            return true;
          }
        }) &&
        item.items.some((itemDetail) => {
          if (filterQuery.doNumber) {
            return itemDetail.doNumber.includes(filterQuery.doNumber);
          } else {
            return true;
          }
        }) &&
        item.items.some((itemDetail) => {
          if (filterQuery.finance) {
            return itemDetail.finance.includes(filterQuery.finance);
          } else {
            return true;
          }
        })
      );
    })
    .sort((a, b) => {
      if (sortQuery === "name") {
        return a.itemName.localeCompare(b.itemName);
      } else if (sortQuery === "po") {
        return a.poDate - b.poDate;
      } else if (sortQuery === "do") {
        return a.items.doDate - b.items.doDate;
      }
    });

  const handleRowSelect = (item) => {
    if (selectedRows.includes(item)) {
      setSelectedRows(selectedRows.filter((selected) => selected !== item));
    } else {
      setSelectedRows([...selectedRows, item]);
    }
  };

  const handleRowSelectAll = () => {
    if (selectedRows.includes(item)) {
      setSelectedRows(selectedRows.filter((selected) => selected !== item));
    } else {
      setSelectedRows([...selectedRows, item]);
    }
  };

  const handleSendFinance = async () => {
    setIsConfirmationOpen(false);
    await axios.put(
      `${window.location.protocol}//${window.location.hostname}:${window.location.port}/orders_be/sendfinance?db=${db}`,
      sendFinance
    );
    setSendFinance({});
    window.location.reload();
  };

  const ackNewDelivery = async () => {
    navigate(`/orders/newdelivery?db=${db}`, {
      state: {
        name: selectedRows.map((item) => ({
          orderID: item.orderID,
          itemName: item.itemName,
          totalQuantity: item.quantity,
          deliveredQuantity: item.deliveredQuantity || 0,
        })),
      },
    });
  };

  const handleCancelOrder = async () => {
    setIsCancelConfirmationOpen(false);
    await axios.put(
      `${window.location.protocol}//${window.location.hostname}:${window.location.port}/orders_be/cancelorder?db=${db}`,
      selectedRows
    );
  };

  return (
    <div>
      <Navbar />
      <div className="topbar">
        <h1 className="title">Order Records</h1>
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
            DownloadTable("table-to-print", "PO & DO Records Report");
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
                    setFilterQuery({});
                    setSortQuery({});
                  }}
                >
                  Clear Filters
                </button>
              </div>
              {selectedRows.length > 0 && (
                <div className="orders_buttons">
                  <button
                    onClick={() => ackNewDelivery()}
                    className="add_new_delivery_button"
                  >
                    Add New Delivery
                  </button>
                  <button
                    onClick={() => setIsCancelConfirmationOpen(true)}
                    className="cancel_order_button"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>

            {showFilters && (
              <div className="inputs">
                <div className="input-field">
                  <h5>PO Date</h5>
                  <div className="date-range-inputs">
                    <input
                      type="date"
                      name="poStartDate"
                      value={filterQuery.poStartDate || ""}
                      onChange={(e) =>
                        handleSetFilters(e.target.name, e.target.value)
                      }
                    />
                    <h5>to</h5>
                    <input
                      type="date"
                      name="poEndDate"
                      value={filterQuery.poEndDate || ""}
                      onChange={(e) =>
                        handleSetFilters(e.target.name, e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="input-field">
                  <h5>PO Number</h5>
                  <input
                    type="text"
                    name="poNumber"
                    value={filterQuery.poNumber || ""}
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
                    <option value="Fulfilled">Fulfilled</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="input-field">
                  <h5>Finance</h5>
                  <select
                    name="finance"
                    value={filterQuery.finance || ""}
                    onChange={(e) =>
                      handleSetFilters(e.target.name, e.target.value)
                    }
                  >
                    <option value="">Select Status</option>
                    <option value="Send">Send</option>
                    <option value="Sent">Sent</option>
                  </select>
                </div>
                <div className="input-field">
                  <h5>DO Date</h5>
                  <div className="date-range-inputs">
                    <input
                      type="date"
                      name="doStartDate"
                      value={filterQuery.doStartDate || ""}
                      onChange={(e) =>
                        handleSetFilters(e.target.name, e.target.value)
                      }
                    />
                    <h5>to</h5>
                    <input
                      type="date"
                      name="doEndDate"
                      value={filterQuery.doEndDate || ""}
                      onChange={(e) =>
                        handleSetFilters(e.target.name, e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="input-field">
                  <h5>DO Number</h5>
                  <input
                    type="text"
                    name="doNumber"
                    value={filterQuery.doNumber || ""}
                    onChange={(e) =>
                      handleSetFilters(e.target.name, e.target.value)
                    }
                  />
                </div>
              </div>
            )}
            {showSort && (
              <div className="inputs">
                <div className="input-field">
                  <h5>Sort By</h5>
                  <select
                    onChange={(e) => {
                      setSortQuery(e.target.value);
                    }}
                    className="sortDropdown"
                  >
                    <option value="">Select...</option>
                    <option value="name">Item Name</option>
                    <option value="po">PO Date</option>
                    <option value="do">DO Date</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <table className="inventory-table" id="table-to-print">
            <thead>
              <tr className="table-header-row">
                <th className="table-header-title"></th>
                <th className="table-header-title">Name</th>
                <th className="table-header-title">PO Date</th>
                <th className="table-header-title">PO Number</th>
                <th className="table-header-title">Quantity</th>
                <th className="table-header-title">Status</th>
                <th className="table-header-title">Remaining</th>
                <th className="table-header-title">Delivered</th>
                <th className="table-header-title">DO Date</th>
                <th className="table-header-title">DO Number</th>
                <th className="table-header-title">Finance Department</th>
              </tr>
            </thead>
            <tbody className="inventory-table-body">
              {filteredInventory.map((item, index) => {
                const itemsArray = item.items;
                const rowSpan = itemsArray.length;

                const poDate = new Date(item.poDate);
                const formattedPoDate = `${String(poDate.getDate()).padStart(
                  2,
                  "0"
                )}/${String(poDate.getMonth() + 1).padStart(
                  2,
                  "0"
                )}/${poDate.getFullYear()}`;

                return (
                  <>
                    {itemsArray.map((itemDetail, idx) => {
                      const doDate = new Date(itemDetail.doDate);
                      const formattedDoDate = `${String(
                        doDate.getDate()
                      ).padStart(2, "0")}/${String(
                        doDate.getMonth() + 1
                      ).padStart(2, "0")}/${doDate.getFullYear()}`;

                      return (
                        <tr key={`${index}-${idx}`}>
                          {idx === 0 && (
                            <>
                              <td rowSpan={rowSpan}>
                                <input
                                  type="checkbox"
                                  checked={selectedRows.includes(item)}
                                  onChange={() => handleRowSelect(item)}
                                  disabled={item.status === "Fulfilled"}
                                />
                              </td>
                              <td rowSpan={rowSpan}>{item.itemName}</td>
                              <td rowSpan={rowSpan}>{formattedPoDate}</td>
                              <td rowSpan={rowSpan}>
                                <a
                                  href={`/orders_be/pdf/${item.poDocument}?db=${db}&doc=po`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {item.poNumber}
                                </a>
                              </td>
                              <td rowSpan={rowSpan}>{item.quantity}</td>
                              <td
                                rowSpan={rowSpan}
                                style={{
                                  color:
                                    item.status === "Pending"
                                      ? "#FF922C"
                                      : item.status === "Fulfilled"
                                      ? "#238823"
                                      : item.status === "Cancelled"
                                      ? "#D2222D"
                                      : "black",
                                }}
                              >
                                {item.status}
                              </td>
                              <td rowSpan={rowSpan}>
                                {item.quantity - item.deliveredQuantity}
                              </td>
                            </>
                          )}
                          {itemDetail && (
                            <>
                              <td>{itemDetail.subQuantity}</td>

                              <td>
                                {!itemDetail.doDate ? "" : formattedDoDate}
                              </td>
                              <td>
                                <a
                                  href={`/orders_be/pdf/${itemDetail.doDocument}?db=${db}&doc=do`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {itemDetail.doNumber}
                                </a>
                              </td>
                              <td>
                                {itemDetail.finance === "Send" ? (
                                  <button
                                    style={{ color: "#FF922C" }}
                                    onClick={() => {
                                      setIsConfirmationOpen(true);
                                      setSendFinance({
                                        doNumber: itemDetail.doNumber,
                                        doDocument: itemDetail.doDocument,
                                      });
                                    }}
                                  >
                                    Send
                                  </button>
                                ) : (
                                  <span style={{ color: "#238823" }}>
                                    {itemDetail.finance}
                                  </span>
                                )}
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleSendFinance}
        message={"Confirm to Send email?"}
      />

      <Confirmation
        isOpen={isCancelConfirmationOpen}
        onClose={() => setIsCancelConfirmationOpen(false)}
        onSubmit={handleCancelOrder}
        message={"Confirm to Cancel orders?"}
      />
    </div>
  );
};

export default Orders;
