import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import axios from "axios";
import Confirmation from "../components/confirmation.jsx";
import { useLocation } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { RxCross2 } from "react-icons/rx";
import { IoMdAdd } from "react-icons/io";

const NewOrder = ({}) => {
  const location = useLocation();
  const db = new URLSearchParams(location.search).get("db");
  const navigate = useNavigate();
  const [poDocument, setPoDocument] = useState();
  const [items, setItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [orderInfo, setOrderInfo] = useState({});
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      await axios
        .get(
          `${window.location.protocol}//${window.location.hostname}:${window.location.port}/inventory_be?db=${db}`
        )
        .then((res) => {
          setItems(res.data.recordset);
        });
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAddPODocument = async (e) => {
    const pdftosend = { poDocument: e };
    setIsUploading(true);
    try {
      await axios
        .post(
          `${window.location.protocol}//${window.location.hostname}:${window.location.port}/orders_be/scanDocument?db=${db}`,
          pdftosend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          setOrderInfo({
            poNumber: res.data.message.poNumber,
            poDate: res.data.message.poDate,
          });
          setPoDocument(res.data.message.orderDocument);
          handlePredictItems(res.data.message.items);
        });
    } catch (error) {
      console.error("Error updating items:", error);
    }
  };

  const handlePredictItems = async (queryItems) => {
    try {
      if (queryItems.length > 0) {
        await axios
          .put(
            `${window.location.protocol}//${window.location.hostname}:${window.location.port}/orders_be/predictitems?db=${db}`,
            { queryItems }
          )
          .then((res) => {
            if (res.data.message.predictedResult.length > 0) {
              res.data.message.predictedResult.forEach((item) => {
                setOrderItems((prevOrderItems) => [
                  ...prevOrderItems,
                  {
                    name: item[0],
                    date: new Date().toISOString().split("T")[0],
                    quantity: item[1],
                  },
                ]);
              });
            }
          });
      }
    } catch (error) {
      console.error("Error updating items:", error);
    }
    setIsUploading(false);
  };

  const handleAddOrderInfo = (e, info) => {
    setOrderInfo((prevState) => ({
      ...prevState,
      [info]: e,
    }));
  };

  const handleAddOrderItem = (name) => {
    setOrderItems([...orderItems, { name: name, quantity: null }]);
  };

  const handleEditOrderItem = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = value;
    setOrderItems(updatedItems);
  };

  const handleDeleteOrderItem = (indexToRemove) => {
    const updatedItems = orderItems.filter(
      (item, index) => index !== indexToRemove
    );
    setOrderItems(updatedItems);
  };

  const handleSubmitOrder = async () => {
    const newOrder = {
      poDocument: poDocument,
      info: orderInfo,
      items: orderItems,
    };

    try {
      await axios.post(
        `${window.location.protocol}//${window.location.hostname}:${window.location.port}/orders_be/neworder?db=${db}`,
        newOrder
      );
    } catch (error) {
      console.error("Error updating items:", error);
    }
    navigate(`/orders?db=${db}`);
  };

  const filteredItems = items.filter((item) => {
    return (
      !searchQuery ||
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div>
      <Navbar />
      <div className="topbar">
        <h1 className="title">Order Form</h1>
      </div>
      <div className="order_table">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsConfirmationOpen(true);
          }}
        >
          <div className="transfer_info_main">
            <div className="transfer_info">
              <div className="transfer-info-input">
                <h5>PO Document</h5>
                <input
                  type="file"
                  name="poDocument"
                  accept=".pdf"
                  onChange={(e) => handleAddPODocument(e.target.files[0])}
                  required
                />
                {isUploading && (
                  <div style={{ marginLeft: "5px" }}>
                    <AiOutlineLoading3Quarters className="loading-circle" />
                  </div>
                )}
              </div>
              <div className="transfer-info-input">
                <h5>PO Number</h5>
                <input
                  type="text"
                  name="poNumber"
                  value={orderInfo.poNumber}
                  onChange={(e) =>
                    handleAddOrderInfo(e.target.value, "poNumber")
                  }
                  required
                />
              </div>
              <div className="transfer-info-input">
                <h5>PO Date</h5>
                <input
                  type="date"
                  name="poDate"
                  value={orderInfo.poDate}
                  onChange={(e) => handleAddOrderInfo(e.target.value, "poDate")}
                  required
                />
              </div>
            </div>
          </div>

          <div className="new-order-table">
            <div className="new-order-table-database">
              <div className="search-container">
                <input
                  type="text"
                  name="itemName"
                  className="search-input"
                  placeholder="Search for item"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                />
                <RxCross2
                  className="clear-search-icon"
                  onClick={() => {
                    setSearchQuery("");
                  }}
                />
              </div>
              {filteredItems.length > 0 && (
                <div className="new-order-table-database-items">
                  <table className="order-table">
                    <thead>
                      <tr>
                        <th className="table-header-title">Item</th>
                      </tr>
                    </thead>
                    <tbody className="inventory-table-body">
                      {filteredItems.map((item, index) => (
                        <tr key={index}>
                          <td key={item.id}>
                            <div className="add-item-table-row">
                              {item.itemName}
                              <IoMdAdd
                                onClick={() => {
                                  handleAddOrderItem(item.itemName);
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <button className="order-submit-button" type="submit">
                Submit
              </button>
            </div>

            {orderItems.length > 0 && (
              <div className="new-order-items">
                <table>
                  <thead>
                    <tr>
                      <th className="table-header-title">Item</th>
                      <th className="table-header-title">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="inventory-table-body">
                    {orderItems.map((orderItem, index) => (
                      <tr key={index}>
                        <td>{orderItem.name}</td>
                        <td>
                          <input
                            required
                            style={{
                              outline: "2px solid black",
                            }}
                            type="number"
                            value={orderItem.quantity}
                            onChange={(e) =>
                              handleEditOrderItem(
                                index,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => {
                              handleDeleteOrderItem(index);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </form>
      </div>
      <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleSubmitOrder}
        message={"Confirm to Add new PO?"}
      />
    </div>
  );
};

export default NewOrder;
