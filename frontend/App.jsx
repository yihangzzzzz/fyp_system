const React = require('react');
const { Route, Routes } = require('react-router-dom');
require('./styles/index.css'); // CSS imports typically handled by build tools

// Import components
const Home = require('./src/pages/Home');
const Inventory = require('./src/pages/Inventory');
const Orders = require('./src/pages/Orders');
const Transfers = require('./src/pages/Transfers');
const NewOrder = require('./src/pages/NewOrder');
const LowStock = require('./src/pages/LowStock');
const NewTransfer = require('./src/pages/NewTransfer');
const NewItem = require('./src/pages/NewItem');
const EditItem = require('./src/pages/EditItem');
const AcceptTransfer = require('./src/pages/AcceptTransfer');
const Login = require('./src/pages/Login');

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

module.exports = App;