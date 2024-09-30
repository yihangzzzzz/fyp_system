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
import ProtectedPage from './pages/ProtectedPage.jsx';
import Users from './pages/Users.jsx';
import MainPage from './pages/MainPage.jsx';
import EmailTemplates from './pages/EmailTemplates.jsx';




// const ViewPDF = require('./pages/ViewPDF');

const App = () => {
  return (
    <div>
            <Routes>
        {/* <DefaultRoute element={<Home/>}/> */}
        {/* <Route path = '/' element = {<Login/>} /> */}
        {/* <Route path = '/login/:lab' element = {<Login/>} /> */}
        <Route path = '/' element = {<MainPage/>} />
        <Route path = '/login' element = {<Login/>} />
        <Route path = '/home' element = {<Home/>} />
        <Route path = '/protected-page' element = {<ProtectedPage/>} />

        <Route path = '/inventory' element = {<Inventory/>} />
        <Route path = '/inventory/lowstock' element = {<LowStock/>} />
        <Route path = '/inventory/newitem' element = {<NewItem/>} />
        <Route path = '/inventory/edititem/:itemName' element={<EditItem />} />

        <Route path = '/orders' element = {<Orders/>} />
        <Route path = '/orders/neworder' element = {<NewOrder/>} />
        <Route path = '/orders/newdelivery' element = {<NewDelivery/>} />
        {/* <Route path = '/orders/pdf/:fileName' element={<ViewPDF />} /> */}

        <Route path = '/transfers' element = {<Transfers/>} />
        <Route path = '/transfers/newtransfer' element = {<NewTransfer/>} />
        <Route path = '/transfers/accepttransfer/:transferID' element = {<AcceptTransfer/>} />

        <Route path = '/settings/usermanagement' element = {<Users/>} />
        <Route path = '/settings/emailtemplates' element = {<EmailTemplates/>} />

        
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