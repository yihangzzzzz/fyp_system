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
const ViewPDF = require('./pages/ViewPDF');

const App = () => {
  return (
    <div>
      <h1>Welcome to the Inventory Management System</h1>
            <Routes>
        <Route path = '/' element = {<Home/>} />

        <Route path = '/inventory' element = {<Inventory/>} />
        <Route path = '/inventory/lowstock' element = {<LowStock/>} />
        <Route path = '/inventory/newitem' element = {<NewItem/>} />
        <Route path = '/inventory/edititem/:itemName' element={<EditItem />} />

        <Route path = '/orders' element = {<Orders/>} />
        <Route path = '/orders/neworder' element = {<NewOrder/>} />
        <Route path = '/orders/pdf/:fileName' element={<ViewPDF />} />

        <Route path = '/transfers' element = {<Transfers/>} />
        <Route path = '/transfers/newtransfer' element = {<NewTransfer/>} />

        
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