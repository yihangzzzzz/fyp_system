const React = require('react');
const { useState } = React;
const { Link } = require('react-router-dom');

const Navbar = () => {

  const [isOpen, setIsOpen] = useState({inventory: false, order: false, transfer: false}); // State to track dropdown visibility

  const toggleDropdown = (type) => {
    setIsOpen(prevState => ({
      ...prevState,
      [type]: !prevState[type]  // Replace with the new value for destination
    }));
  };

    return (
      // <nav className="navbar">
      //   <ul className="navbar-links">
      //     <li>
      //       <Link to="/">Home</Link>
      //     </li>
      //     <li>
      //           <Link to="#" className="dropbtn" onFocus={() => toggleDropdown('inventory')}>
      //               Inventory
      //           </Link>
                
      //               <ul className="dropdown-content">
      //                   <li>
      //                       <Link to="/inventory">Items</Link>
      //                   </li>
      //                   <li>
      //                       <Link to="/inventory/lowstock">Low Stock</Link>
      //                   </li>
      //               </ul>
                
      //     </li>
      //     <li>
      //           <Link to="#" className="dropbtn" onClick={() => toggleDropdown('order')}> 
      //               Orders
      //           </Link>

      //               <ul className="dropdown-content">
      //                   <li>
      //                     <Link to="/orders">All Orders</Link>
      //                   </li>
      //                   <li>
      //                     <Link to="/orders/neworder">New Order</Link>
      //                   </li>
      //               </ul>
                
      //     </li>
      //     <li>
      //           <Link to="#" className="dropbtn" onClick={() => toggleDropdown('transfer')}>
      //               Transfer
      //           </Link>
        
      //               <ul className="dropdown-content">
      //                   <li>
      //                     <Link to="/transfers">All Transfers</Link>
      //                   </li>
      //                   <li>
      //                     <Link to="/transfers/newtransfer">New Transfer</Link>
      //                   </li>
      //               </ul>
                    
                
      //     </li>

      //   </ul>
      // </nav>
      
      <div className='navbar'>
            <div className="dropdown">
              <Link to="/api" style={{fontSize: '16px', padding: '10px'}}>Home</Link>
            </div>
            <div className="dropdown">
                <button className="dropbtn">Inventory</button>
                <ul className="dropdown-content">
                    <li><Link to="/api/inventory">Items</Link></li>
                    <li><Link to="/api/inventory/lowstock">Low Stock</Link></li>
                    <li><Link to="/api/inventory/newitem">New Item</Link></li>
                </ul>
            </div>

            <div className="dropdown">
                <button className="dropbtn">Orders</button>
                <ul className="dropdown-content">
                    <li><Link to="/api/orders">Current Orders</Link></li>
                    <li><Link to="/api/orders/neworder">New Order</Link></li>
                </ul>
            </div>

            <div className="dropdown">
                <button className="dropbtn">Transfers</button>
                <ul className="dropdown-content">
                    <li><Link to="/api/transfers">All Transfers</Link></li>
                    <li><Link to="/api/transfers/newtransfer">New Transfer</Link></li>
                </ul>
            </div>
        </div>
    );
};


module.exports = Navbar