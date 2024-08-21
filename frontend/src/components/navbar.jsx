import React, {useState} from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {

  const [inventoryDropdown, setInventoryDropdown] = useState(false);

  const toggleDropdown = () => {
      setInventoryDropdown(!inventoryDropdown);
  };

    return (
      <nav className="navbar">
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li 
              className="dropdown"
              onClick={toggleDropdown}
              onBlur={toggleDropdown}
              // onMouseEnter={toggleDropdown}
              // onMouseLeave={toggleDropdown}
                >
                <Link to="#" className="dropbtn">
                    Inventory
                </Link>
                { (
                    <ul className="dropdown-content">
                        <li>
                            <Link to="/inventory">Items</Link>
                        </li>
                        <li>
                            <Link to="/inventory/order">Order</Link>
                        </li>
                        <li>
                            <Link to="/inventory/lowstock">Low Stock</Link>
                        </li>
                    </ul>
                )}
          </li>
          <li>
            <Link to="/inventory/order">Orders</Link>
          </li>
          {/* <li>
            <Link to="/Orders">PO</Link>
          </li> */}
          <li>
            <Link to="/transfer">Transfers</Link>
          </li>
          {/* <li>
            <Link to="/inventory">Items</Link>
          </li> */}
        </ul>
      </nav>
    );
  }

export default Navbar