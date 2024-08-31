import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './src/pages/Home'
import Inventory from './src/pages/Inventory'
import Orders from './src/pages/Orders'
import Transfers from './src/pages/Transfers'
import NewOrder from './src/pages/NewOrder'
import LowStock from './src/pages/LowStock'
import NewTransfer from './src/pages/NewTransfer'
import NewItem from './src/pages/NewItem'
import EditItem from './src/pages/EditItem'
import ViewPDF from './src/pages/ViewPDF'

export const App = () => {
  return (
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
  );
};

export default App