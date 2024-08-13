import React, { useState } from 'react';
import Navbar from '../components/navbar';

const Transfer = () => {

    const [loading, setLoading] = useState(false);
    const [inventories, setInventory] = useState([]);

    useEffect(() => {
      axios
          .get("http://localhost:3000/inventory")
          .then((res) => {
              setInventory(res.data);
              setLoading(false);
          })
          .catch((error) => {
              console.log("le error is " + error);
              setLoading(false);
          });
      

  }, []);

  const calculateTotal = (labs) => {
    const totalCounter = labs.reduce((totalCounter, lab) => {
      return totalCounter + lab.stock.counter;
    })
    const totalWarehouse = labs.reduce((totalWarehouse, lab) => {
      return totalWarehouse + lab.stock.warehouse;
    })
    return (totalCounter, totalWarehouse)
  }

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
                      <th style={{ fontWeight: 'bold' }}>Counter</th>
                      <th style={{ fontWeight: 'bold' }}>Warehouse</th>
                      <th style={{ fontWeight: 'bold' }}>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {items.map((item, index) => (
                      <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.serial}</td>
                          <td>{item.category}</td>
                          <td>{}</td>
                          <td>{item.ordered}</td>
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