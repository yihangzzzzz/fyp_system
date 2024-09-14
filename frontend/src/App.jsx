const React = require('react');
const { Route, Routes } = require('react-router-dom');
require('./styles/index.css'); // CSS imports typically handled by build tools

// Import components
const Home = require('./pages/Home');
const Inventory = require('./pages/Inventory');
const Orders = require('./pages/Orders');
const Transfers = require('./pages/Transfers');
const NewOrder = require('./pages/NewOrder');
const LowStock = require('./pages/LowStock');
const NewTransfer = require('./pages/NewTransfer');
const NewItem = require('./pages/NewItem');
const EditItem = require('./pages/EditItem');
const AcceptTransfer = require('./pages/AcceptTransfer');

// const ViewPDF = require('./pages/ViewPDF');

const App = () => {
  return (
    <div>
            <Routes>
        <Route path = '/' element = {<Home/>} />

        <Route path = '/api/inventory' element = {<Inventory/>} />
        <Route path = '/api/inventory/lowstock' element = {<LowStock/>} />
        <Route path = '/api/inventory/newitem' element = {<NewItem/>} />
        <Route path = '/api/inventory/edititem/:itemName' element={<EditItem />} />

        <Route path = '/api/orders' element = {<Orders/>} />
        <Route path = '/api/orders/neworder' element = {<NewOrder/>} />
        {/* <Route path = '/orders/pdf/:fileName' element={<ViewPDF />} /> */}

        <Route path = '/api/transfers' element = {<Transfers/>} />
        <Route path = '/api/transfers/newtransfer' element = {<NewTransfer/>} />
        <Route path = '/api/transfers/accepttransfer/' element = {<AcceptTransfer/>} />

        
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

module.exports = App;