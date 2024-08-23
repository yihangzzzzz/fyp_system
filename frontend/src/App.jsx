import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import Inventory from './pages/Inventory'
import Orders from './pages/Orders'
import Transfers from './pages/Transfers'
import NewOrder from './pages/NewOrder'
import LowStock from './pages/LowStock'
import NewTransfer from './pages/NewTransfer'

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
      </Routes>
  );
};

export default App