import axios from "axios";
import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';

const Transfer = () => {

    const [loading, setLoading] = useState(false);
    const [inventories, setInventory] = useState([]);

    useEffect(() => {
      axios
          .get("http://localhost:3000/inventory")
          .then((res) => {
              setInventory(res.data.recordset);
              setLoading(false);
          })
          .catch((error) => {
              console.log("le error is " + error);
              setLoading(false);
          })
  }, []);



  return (
    <div>
      <Navbar />
      <div className='topbar'>
          <h1 className="title">Hardware Inventory</h1>
      </div>
      {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="inventory_table">
                  <table>
                      <thead>
                          <tr>
                              <th style={{ fontWeight: 'bold' }}>Name</th>
                              <th style={{ fontWeight: 'bold' }}>Serial Number</th>
                              <th style={{ fontWeight: 'bold' }}>Quantity</th>
                          </tr>
                      </thead>
                      <tbody>
                          {inventories.map((item, index) => (
                              <tr key={index}>
                                  <td>{item["Item Name"]}</td>
                                  <td>{item["Serial Number"]}</td>
                                  <td>{item["Quantity"]}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                </div>
            )}
    </div>

)
}
   
  

export default Transfer