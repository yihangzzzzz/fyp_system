const axios = require('axios');
const React = require('react');
const { useEffect, useState } = React;
const { MdOutlineAddBox } = require('react-icons/md');
const { RxCross1 } = require('react-icons/rx');
const Navbar = require('../components/navbar');
const Confirmation = require('../components/confirmation');
const { useNavigate } = require('react-router-dom');

const Transfers = () => {
    const navigate = useNavigate(); 
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    // const [sortAttribute, setSortAttribute] = useState(''); // State for sort attribute
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [statusChange, setStautsChange] = useState({status: '', id: '', items: ''});
    
    useEffect(() => {
        fetchInventory();
    }, []);
    // const refreshData = () => {
    //     fetchInventory(setInventory, setLoading);
    //   };
    
    //   useEffect(() => {
    //     refreshData();
    //   }, []);

    const fetchInventory = async (sortAtt) => {
        await axios
        .get("http://www.iistesting.com:3000/transfers", {params: {sortBy: sortAtt}})
        .then((res) => {
            setInventory(res.data.recordset);
            setLoading(false);
        })
        .catch((error) => {
            console.log("le error is " + error);
            setLoading(false);
        });
    }
    const handleSearch = (e) => {
        setSearchQuery(e.target.value); // Update search query as the user types
    };

    const handleReset = () => {
        setSearchQuery("");
        fetchInventory();
    }

    const handleTransferStatusChange = async () => {
        setIsConfirmationOpen(false);
        await axios
        .put("http://www.iistesting.com:3000/transfers", statusChange);
        setStautsChange({status: '', id: null, items: null});
        fetchInventory();
    }

    const filteredInventory = inventory.filter((item) =>
        item.items.toLowerCase().includes(searchQuery.toLowerCase())
    );



  return (
    <div>
      <Navbar />
      <div className='topbar'>
                <h1 className="title">Transfer Records</h1>
                {/* <MdOutlineAddBox title='Add New Item' className='addButton' onClick={() => setIsModalOpen(true)} /> */}
                <input 
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className='searchBar'
                />
                <select onChange={(e) => {fetchInventory(e.target.value)}} className='sortDropdown'>
                    <option value="">Sort by...</option>
                    <option value="name">Item Name</option>
                    <option value="quantity">Quantity</option>
                    <option value="date">Date</option>
                    <option value="destination">Destination</option>
                </select>
                <RxCross1 title='Reset' className='addButton' onClick={handleReset} />
        </div>
      {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="inventory_table">
                  <table>
                      <thead>
                          <tr>
                              <th style={{ fontWeight: 'bold' }}>Destination</th>
                              <th style={{ fontWeight: 'bold' }}>Date</th>
                              <th style={{ fontWeight: 'bold' }}>Recipient</th>
                              <th style={{ fontWeight: 'bold' }}>Email</th>
                              <th style={{ fontWeight: 'bold' }}>Transfer Document</th>
                              <th style={{ fontWeight: 'bold' }}>Status</th>
                              {/* <th style={{ fontWeight: 'bold' }}>Description</th> */}
                              <th style={{ fontWeight: 'bold' }}>Items</th>
                              <th style={{ fontWeight: 'bold' }}>Quantity</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredInventory.map((item, index) => {

                                const itemsArray = item.items.split(', ');
                                const rowSpan = itemsArray.length;
                                const date = new Date(item.date);
                                const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

                                return (
                                    <>
                                        {itemsArray.map((itemDetail, idx) => (
                                            
                                            <tr key={`${index}-${idx}`}>
                                                {idx === 0 && (
                                                    <>
                                                        <td rowSpan={rowSpan}>{item.destination}</td>
                                                        <td rowSpan={rowSpan}>{formattedDate}</td>
                                                        <td rowSpan={rowSpan}>{item.recipient}</td>
                                                        <td rowSpan={rowSpan}>{item.email}</td>
                                                        <td rowSpan={rowSpan}>
                                                            <a href={`/transfers/pdf/${item.transferDocument}`} target="_blank" rel="noopener noreferrer">
                                                                VIew PDF
                                                            </a>
                                                        </td>
                                                        {/* <td rowSpan={rowSpan}>{item.description}</td> */}
                                                        <td rowSpan={rowSpan}>
                                                        <select
                                                            disabled={item.status === "Acknowledged"} 
                                                            value={item.status}
                                                            onChange={(e) => {
                                                                setStautsChange({status: e.target.value, id: item.transferID, items: itemsArray});
                                                                setIsConfirmationOpen(true);
                                                            }}
                                                            style={{
                                                                color: 
                                                                  item.status === 'Pending'
                                                                    ? '#FF922C'
                                                                    : item.status === 'Acknowledged'
                                                                    ? '#238823'
                                                                    : item.status === 'Cancelled'
                                                                    ? '#D2222D'
                                                                    : 'black', // default color
                                                              }}
                                                            >
                                                            <option style={{ color: 'black' }} value="Pending">Pending</option>
                                                            <option style={{ color: 'black' }} value="Acknowledged">Acknowledged</option>
                                                            <option style={{ color: 'black' }} value="Cancelled">Cancelled</option>
                                                            </select>
                                                        </td>
                                                    </>
                                                )}
                                                {/* Split itemDetail to separate itemName and quantity */}
                                                <td>{itemDetail.split(':')[0]}</td>
                                                <td>{itemDetail.split(':')[1]}</td>
                                                
                                            </tr>
                                        ))}
                                    </>
                                );


                                // const date = new Date(item.date);
                                // const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                                // return ((
                                //     <tr key={index}>
                                //         <td>{item.destination}</td>
                                //         <td>{formattedDate}</td>
                                //         <td>{item.recipient}</td>
                                //     </tr>
                                // ))
                          })}
                      </tbody>
                  </table>
                </div>
            )}
        <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleTransferStatusChange}/>
    </div>

)
}
   
  

module.exports = Transfers