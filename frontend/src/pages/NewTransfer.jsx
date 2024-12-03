import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar.jsx";
import Confirmation from "../components/confirmation.jsx";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { checkEmail } from "../functions/checkEmail.jsx";
import { RxCross2 } from "react-icons/rx";
import { IoMdAdd } from "react-icons/io";

const NewTransfer = ({}) => {
  const location = useLocation();
  const db = new URLSearchParams(location.search).get("db");
  const itemID = parseInt(
    new URLSearchParams(location.search).get("itemID"),
    10
  );
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [labs, setLabs] = useState([]);
  const [transferLabs, setTransferLabs] = useState([]);
  const [transferItems, setTransferItems] = useState([]);
  const [transferInfo, setTransferInfo] = useState({
    db: db,
    destination: "",
    date: new Date().toISOString().split("T")[0],
    recipient: "",
    email: "",
    status: "",
    type: "Transfer Out",
    remarks: "",
    sender: "",
  });
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const x = "";

  useEffect(() => {
    fetchItems();
    fetchLabs();
  }, []);

  const fetchItems = async () => {
    try {
      await axios
        .get(
          `${window.location.protocol}//${window.location.hostname}:${window.location.port}/inventory_be?db=${db}`
        )
        .then((res) => {
          setItems(res.data.recordset);
          if (itemID) {
            const record = res.data.recordset.find(
              (item) => item.itemID === itemID
            );
            setTransferItems([
              ...transferItems,
              {
                itemID: itemID,
                name: record.itemName,
                cabinet: record.cabinet,
                counter: record.counter,
                quantity: null,
              },
            ]);
          }
        });
    } catch (error) {
      console.error("Error fetching items:", error);
    }
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

  const handleAddTransferItem = (itemID, name, cabinet, counter) => {
    setTransferItems([
      ...transferItems,
      {
        itemID: itemID,
        name: name,
        cabinet: cabinet,
        counter: counter,
        quantity: null,
      },
    ]);
  };

  const handleTransferInfoChange = (e, info) => {
    setTransferInfo((prevState) => ({
      ...prevState,
      [info]: e,
    }));
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...transferItems];
    updatedItems[index][field] = value;
    setTransferItems(updatedItems);
  };

  const handleDeleteOrderItem = (indexToRemove) => {
    const updatedItems = transferItems.filter(
      (item, index) => index !== indexToRemove
    );
    setTransferItems(updatedItems);
  };

  const handleAddTransferLab = (lab) => {
    setTransferLabs([...transferLabs, { lab: lab, recipient: "", email: "" }]);
  };

  const handleLabInputChange = (index, value, field) => {
    const updatedLabs = [...transferLabs];
    updatedLabs[index][field] = value;
    setTransferLabs(updatedLabs);
  };

  const handleDeleteLab = (indexToRemove) => {
    const updatedLabs = transferLabs.filter(
      (item, index) => index !== indexToRemove
    );
    setTransferLabs(updatedLabs);
  };

  const handleSubmitTransfer = () => {
    const newTransfer = {
      info: transferInfo,
      items: transferItems,
      labs: transferLabs,
      url: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
    };

    try {
      setIsConfirmationOpen(false);

      axios
        .post(
          `${window.location.protocol}//${window.location.hostname}:${window.location.port}/transfers_be/newtransfer?db=${db}`,
          newTransfer
        )
        .then((res) => {});
    } catch (error) {
      console.error("Error updating items:", error);
    }

    navigate(`/transfers?db=${db}`);
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
        <h1 className="title">New Transfer Form</h1>
      </div>

      <div className="order_table">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsConfirmationOpen(true);
          }}
        >
          {labs.length > 0 && (
            <div className="transfer_info_main">
              <div className="transfer_info">
                <div className="transfer-info-input">
                  <h5>Type</h5>
                  <select
                    value={transferInfo.type}
                    required
                    onChange={(e) =>
                      handleTransferInfoChange(e.target.value, "type")
                    }
                  >
                    <option value="Transfer Out">Transfer Out</option>
                    <option value="Transfer In">Transfer In</option>
                    <option value="Loan">Loan</option>
                    <option value="Miscellaneous">
                      Cabinet,Counter,Lost/Damaged
                    </option>
                  </select>
                </div>

                <div className="transfer-info-input">
                  <h5>Date</h5>
                  <input
                    type="date"
                    value={transferInfo.date}
                    onChange={(e) =>
                      handleTransferInfoChange(e.target.value, "date")
                    }
                    required
                  />
                </div>
                {transferInfo.type != "Miscellaneous" && (
                  <div className="transfer-info-input">
                    <h5>Sender</h5>
                    <input
                      required
                      type="text"
                      value={transferInfo.sender}
                      onChange={(e) =>
                        handleTransferInfoChange(e.target.value, "sender")
                      }
                    />
                  </div>
                )}
                <div className="transfer-info-input">
                  <h5>Remarks</h5>
                  <textarea
                    type="text"
                    value={transferInfo.remarks}
                    onChange={(e) =>
                      handleTransferInfoChange(e.target.value, "remarks")
                    }
                  />
                </div>
              </div>

              <div className="transfer_info">
                <div className="transfer-info-input">
                  {transferInfo.type === "Transfer In" ? (
                    <>
                      <h5>Source</h5>
                    </>
                  ) : (
                    <>
                      <h5>Destination</h5>
                    </>
                  )}
                  <select
                    value={transferInfo.destination}
                    requried
                    onChange={(e) => handleAddTransferLab(e.target.value)}
                    disabled={
                      transferInfo.type === "Miscellaneous" &&
                      transferLabs.length > 0
                    }
                  >
                    <option value="" disabled>
                      Select Lab
                    </option>
                    {labs
                      .filter(
                        (item) =>
                          item.type ===
                          (transferInfo.type === "Miscellaneous"
                            ? "Miscellaneous"
                            : "All")
                      )
                      .map((item) => (
                        <option key={item.id} value={item.labCode}>
                          {item.labCode}
                        </option>
                      ))}
                  </select>
                </div>
                {transferLabs.length > 0 && (
                  <table className="new-order-items">
                    <thead>
                      <tr>
                        <th className="table-header-title">Lab</th>
                        {transferInfo.type != "Miscellaneous" && (
                          <th className="table-header-title">Recipient</th>
                        )}
                        {transferInfo.type != "Miscellaneous" && (
                          <th className="table-header-title">
                            Recipient Email
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="inventory-table-body">
                      {transferLabs.map((transferLab, index) => (
                        <tr className="fixed-height-row" key={index}>
                          <td>{transferLab.lab}</td>
                          {transferInfo.type != "Miscellaneous" && (
                            <>
                              <td>
                                <input
                                  type="text"
                                  value={transferLab.recipient}
                                  onChange={(e) =>
                                    handleLabInputChange(
                                      index,
                                      e.target.value,
                                      "recipient"
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  required
                                  type="text"
                                  value={transferLab.email}
                                  onChange={(e) =>
                                    handleLabInputChange(
                                      index,
                                      e.target.value,
                                      "email"
                                    )
                                  }
                                  onBlur={(e) => {
                                    const email = e.target.value;
                                    if (checkEmail(email)) {
                                      return;
                                    } else {
                                      alert(`Please enter valid email`);
                                    }
                                  }}
                                />
                              </td>
                            </>
                          )}

                          <td>
                            <button
                              type="button"
                              onClick={() => {
                                handleDeleteLab(index);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

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
                                  handleAddTransferItem(
                                    item.itemID,
                                    item.itemName,
                                    item.cabinet,
                                    item.counter
                                  );
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

            {transferItems.length > 0 && (
              <div className="new-order-items">
                <table>
                  <thead>
                    <tr>
                      <th className="table-header-title">Item</th>

                      {transferInfo.type === "Miscellaneous" &&
                      transferLabs.length > 0 &&
                      transferLabs[0].lab.includes("Cabinet") ? (
                        <th className="table-header-title">
                          Current Counter Stock
                        </th>
                      ) : (
                        <th className="table-header-title">
                          Current Cabinet Stock
                        </th>
                      )}
                      <th className="table-header-title">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="inventory-table-body">
                    {transferItems.map((transferItem, index) => (
                      <tr className="fixed-height-row" key={index}>
                        <td>{transferItem.name}</td>
                        {transferInfo.type === "Miscellaneous" &&
                        transferLabs.length > 0 &&
                        transferLabs[0].lab.includes("Cabinet") ? (
                          <td>{transferItem.counter}</td>
                        ) : (
                          <td>{transferItem.cabinet}</td>
                        )}
                        <td>
                          <input
                            required
                            style={{
                              outline: "2px solid black",
                            }}
                            type="number"
                            value={transferItem.quantity}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              if (
                                (transferInfo.type != "Transfer In" &&
                                  value > transferItem.cabinet) ||
                                (transferInfo.destination === "SPL Cabinet" &&
                                  value > transferItem.counter)
                              ) {
                                alert(
                                  `Quantity cannot be greater than current quantity`
                                );
                              } else {
                                handleInputChange(
                                  index,
                                  "quantity",
                                  Number(e.target.value)
                                );
                              }
                            }}
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
        onSubmit={handleSubmitTransfer}
        message={"Confirm to Add new transfer?"}
      />
    </div>
  );
};

export default NewTransfer;
