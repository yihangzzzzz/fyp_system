// const React = require('react');
// const { Route, Routes } = require('react-router-dom');
// require('./styles/index.css'); // CSS imports typically handled by build tools

// // Import components
// const Home = require('./pages/Home');
// const Inventory = require('./pages/Inventory');
// const Orders = require('./pages/Orders');
// const Transfers = require('./pages/Transfers');
// const NewOrder = require('./pages/NewOrder');
// const LowStock = require('./pages/LowStock');
// const NewTransfer = require('./pages/NewTransfer');
// const NewItem = require('./pages/NewItem');
// const EditItem = require('./pages/EditItem');
// const AcceptTransfer = require('./pages/AcceptTransfer');
// const Login = require('./pages/Login');
// const NewDelivery = require('./pages/NewDelivery');

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './styles/index.css'; // CSS imports typically handled by build tools

// Import components
import Home from './pages/Home.jsx';
import Inventory from './pages/Inventory.jsx';
import Orders from './pages/Orders.jsx';
import Transfers from './pages/Transfers.jsx';
import NewOrder from './pages/NewOrder.jsx';
import LowStock from './pages/LowStock.jsx';
import NewTransfer from './pages/NewTransfer.jsx';
import NewItem from './pages/NewItem.jsx';
import EditItem from './pages/EditItem.jsx';
import AcceptTransfer from './pages/AcceptTransfer.jsx';
import Login from './pages/Login.jsx';
import NewDelivery from './pages/NewDelivery.jsx';



// const ViewPDF = require('./pages/ViewPDF');

const App = () => {
  return (
    <div>
            <Routes>
        {/* <DefaultRoute element={<Home/>}/> */}
        {/* <Route path = '/' element = {<Login/>} /> */}
        <Route path = '/' element = {<Login/>} />
        <Route path = '/api' element = {<Home/>} />

        <Route path = '/api/inventory' element = {<Inventory/>} />
        <Route path = '/api/inventory/lowstock' element = {<LowStock/>} />
        <Route path = '/api/inventory/newitem' element = {<NewItem/>} />
        <Route path = '/api/inventory/edititem/:itemName' element={<EditItem />} />

        <Route path = '/api/orders' element = {<Orders/>} />
        <Route path = '/api/orders/neworder' element = {<NewOrder/>} />
        <Route path = '/api/orders/newdelivery' element = {<NewDelivery/>} />
        {/* <Route path = '/orders/pdf/:fileName' element={<ViewPDF />} /> */}

        <Route path = '/api/transfers' element = {<Transfers/>} />
        <Route path = '/api/transfers/newtransfer' element = {<NewTransfer/>} />
        <Route path = '/api/transfers/accepttransfer/:transferID' element = {<AcceptTransfer/>} />

        
      </Routes>
    </div>

  );
};

// const App = () => {
//   return (
//     <div>
//       <h1>Hello, World!</h1>
//     </div>
//   );
// };

// module.exports = App;
export default App;