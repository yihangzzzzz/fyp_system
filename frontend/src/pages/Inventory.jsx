import axios from "axios";
import React, { useEffect, useState } from 'react';
import { MdOutlineAddBox } from 'react-icons/md';
import Modal from '../components/modal';
import Navbar from '../components/navbar';
import NewItemForm from "../components/newItemForm";

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(() => {
        axios
            .get("http://localhost:3000/hardware")
            .then((res) => {
                setItems(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log("le error is " + error);
                setLoading(false);
            })
    }, []);

    const handleAddItem = (newItem) => {
      axios.post("http://localhost:3000/hardware", newItem)
        .then(() => {
          setItems([...items, newItem]);
          setIsModalOpen(false);
        })
        .catch((error) => {
          console.log("Error adding item: " + error);
        });
    };

    return (

        <div>
            <Navbar />
            <div className='topbar'>
                <h1 className="title">Hardware Inventory</h1>
                <MdOutlineAddBox title='Add New Item' className='addButton' onClick={() => setIsModalOpen(true)} />
                {/* <Link to='/inventory/add'>
                    <MdOutlineAddBox className='addButton' />
                </Link> */}
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
                              <th style={{ fontWeight: 'bold' }}>Category</th>
                              <th style={{ fontWeight: 'bold' }}>Quantity</th>
                              <th style={{ fontWeight: 'bold' }}>Ordered</th>
                              <th style={{ fontWeight: 'bold' }}>Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {items.map((item, index) => (
                              <tr key={index}>
                                  <td>{item.name}</td>
                                  <td>{item.serial}</td>
                                  <td>{item.category}</td>
                                  <td>{item.quantity}</td>
                                  <td>{item.ordered}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                </div>
            )}
            <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddItem}
        FormComponent={NewItemForm}
      />
      </div>

    );
}

export default Inventory