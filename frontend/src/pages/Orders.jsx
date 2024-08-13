import axios from "axios";
import React, { useEffect, useState } from 'react';
import { MdDelete, MdEdit, MdOutlineAddBox } from 'react-icons/md';
import Modal from '../components/modal';
import Navbar from '../components/navbar';
import NewOrderForm from "../components/newOrderForm";
import NewPOForm from '../components/newPOForm';
import StatusDropdown from "../components/statusDropdown";

const Orders = () => {

  const [pos, setPOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);

  const fetchData = async (setPOs, setOrders, setLoading) => {
    try {
      await axios
      .get("http://localhost:3000/po")
      .then((res) => {
          setPOs(res.data);
          setLoading(false);
      })
      await axios
      .get("http://localhost:3000/order")
      .then((res) => {
          setOrders(res.data);
          setLoading(false);
      })
    } catch(error) {
      console.log("le error is " + error);
      setLoading(false);
    }
  }

  const refreshData = () => {
    fetchData(setPOs, setOrders, setLoading);
  };

  useEffect(() => {
    refreshData();
  }, []);
  // useEffect(() => {
  //   axios
  //       .get("http://localhost:3000/po")
  //       .then((res) => {
  //           setPOs(res.data);
  //           setLoading(false);
  //       })
  //       .catch((error) => {
  //           console.log("le error is " + error);
  //           setLoading(false);
  //       })

  //   axios
  //   .get("http://localhost:3000/order")
  //   .then((res) => {
  //       setOrders(res.data);
  //       setLoading(false);
  //   })
  //   .catch((error) => {
  //       console.log("le error is " + error);
  //       setLoading(false);
  //   })

  // }, []);

  const handleAddPO = (newPO) => {
    axios.post("http://localhost:3000/po", newPO)
      .then(() => {
        setPOs([...pos, newPO]);
        setIsPOModalOpen(false);
      })
      .catch((error) => {
        console.log("Error adding item: " + error);
      });

    axios.put("http://localhost:3000/hardware/qty", newPO);
  };

  const handleAddOrder = (newOrder) => {
    axios.post("http://localhost:3000/order", newOrder)
      .then(() => {
        setOrders([...orders, newOrder]);
        setIsOrderModalOpen(false);
      })
      .catch((error) => {
        console.log("Error adding item: " + error);
      });

    axios.put("http://localhost:3000/hardware/ordered", newOrder);
  };

  const handleStatusChange = (orderID, newStatus) => {
    const query = {
      id: orderID,
      status: newStatus
    }
    console.log(query.id);
    console.log(query.status);
    axios.put("http://localhost:3000/order/status", query)
  }


  return (
    <div>
        <Navbar />
            <div className='topbar'>
                <h1 className="title">Orders</h1>
                {/* <MdOutlineAddBox className='addButton' /> */}
                <MdOutlineAddBox className='addButton' onClick={() => setIsOrderModalOpen(true)} />
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="po-table">
                  <table>
                      <thead>
                          <tr>
                              <th style={{ fontWeight: 'bold' }}>Date</th>
                              <th style={{ fontWeight: 'bold' }}>Order Number</th>
                              <th style={{ fontWeight: 'bold' }}>Item</th>
                              <th style={{ fontWeight: 'bold' }}>Serial Number</th>
                              <th style={{ fontWeight: 'bold' }}>Quantity</th>
                              <th style={{ fontWeight: 'bold' }}>Status</th>
                          </tr>
                      </thead>
                      <tbody>
                          {orders.map((order, index) => {
                            const date = new Date(order.date);
                            const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                            return (
                            <tr key={index}>
                              <td>{formattedDate}</td>
                              <td>{order.number}</td>
                              <td>{order.name}</td>
                              <td>{order.serial}</td>
                              <td>{order.quantity}</td>
                              <td>

                                  {editingOrderId === index ? (
                                  <StatusDropdown
                                    currentStatus={order.status}
                                    onStatusChange={(newStatus) => handleStatusChange(order._id, newStatus)}
                                    onClose={() => {
                                      refreshData();
                                      setEditingOrderId(null);
                                    }}
                                  />
                                ) : (
                                  <>
                                    <span
                                      style={{
                                        color: order.status === 'Pending' ? '#e28743' : 
                                              order.status === 'Fulfilled' ? '#448722' : 
                                              order.status === 'Cancelled' ? '#9A1A1C': 'black',
                                        fontWeight: 'bold',
                                        marginRight: '8px'
                                      }}
                                    >
                                      {order.status}
                                    </span>
                                    <button
                                      onClick={() => {
                                        setEditingOrderId(index);
                                      }}
                                      style={{ cursor: 'pointer', color: 'blue' }}
                                    >
                                      <MdEdit color="#1D9BC7"/>
                                    </button>
                                    <button
                                      onClick={() => {
                                      }}
                                      style={{ cursor: 'pointer', color: 'blue' }}
                                    >
                                      <MdDelete color="#1D9BC7"/>
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                            );
                          }
                          )}
                      </tbody>
                  </table>
                </div>
            )}
            <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSubmit={handleAddOrder}
        FormComponent={NewOrderForm}
      />
      <div className='topbar'>
                <h1 className="title">PO Records</h1>
                {/* <MdOutlineAddBox className='addButton' /> */}
                <MdOutlineAddBox className='addButton' onClick={() => setIsPOModalOpen(true)} />
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="po-table">
                  <table>
                      <thead>
                          <tr>
                              <th style={{ fontWeight: 'bold' }}>Date</th>
                              <th style={{ fontWeight: 'bold' }}>PO Number</th>
                              <th style={{ fontWeight: 'bold' }}>Item</th>
                              <th style={{ fontWeight: 'bold' }}>Serial Number</th>
                              <th style={{ fontWeight: 'bold' }}>Quantity</th>
                          </tr>
                      </thead>
                      <tbody>
                          {pos.map((po, index) => {
                            const date = new Date(po.date);
                            const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                            return (
                            <tr key={index}>
                              <td>{formattedDate}</td>
                              <td>{po.number}</td>
                              <td>{po.name}</td>
                              <td>{po.serial}</td>
                              <td>{po.quantity}</td>
                            </tr>
                            );
                          }
                          )}
                      </tbody>
                  </table>
                </div>
            )}
            <Modal
        isOpen={isPOModalOpen}
        onClose={() => setIsPOModalOpen(false)}
        onSubmit={handleAddPO}
        FormComponent={NewPOForm}
      />
    </div>
  );
}
 export default Orders