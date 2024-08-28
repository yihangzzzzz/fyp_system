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

export const App = () => {
  return (
      <Routes>
        <Route path = '/' element = {<Home/>} />
        <Route path = '/inventory' element = {<Inventory/>} />
        <Route path = '/orders/neworder' element = {<NewOrder/>} />
        <Route path = '/orders' element = {<Orders/>} />
        <Route path = '/transfers' element = {<Transfers/>} />
        <Route path = '/transfers/newtransfer' element = {<NewTransfer/>} />
        <Route path = '/inventory/lowstock' element = {<LowStock/>} />
        <Route path = '/inventory/newitem' element = {<NewItem/>} />
      </Routes>
  );
};

export default App