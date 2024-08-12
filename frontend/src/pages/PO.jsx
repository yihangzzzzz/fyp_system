import React, { useEffect, useState } from 'react'
import axios from "axios"
import Modal from '../components/modal';
import Navbar from '../components/navbar';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import NewPOForm from '../components/newPOForm';

const PO = () => {

  const [pos, setPOs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios
        .get("http://localhost:3000/po")
        .then((res) => {
            setPOs(res.data);
            setLoading(false);
        })
        .catch((error) => {
            console.log("le error is " + error);
            setLoading(false);
        })
  }, []);

  const handleAddPO = (newPO) => {
    axios.post("http://localhost:3000/po", newPO)
      .then(() => {
        setPOs([...pos, newPO]);
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
                <h1 className="title">PO Records</h1>
                {/* <MdOutlineAddBox className='addButton' /> */}
                <MdOutlineAddBox className='addButton' onClick={() => setIsModalOpen(true)} />
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPO}
        FormComponent={NewPOForm}
      />
    </div>
  );
}
 export default PO