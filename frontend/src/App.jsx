import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import Inventory from './pages/Inventory'
import Orders from './pages/Orders'
import Transfer from './pages/Transfer'
import Order from './pages/Order'
import LowStock from './pages/LowStock'

export const App = () => {
  return (
      <Routes>
        <Route path = '/' element = {<Home/>} />
        <Route path = '/inventory' element = {<Inventory/>} />
        <Route path = '/inventory/order' element = {<Order/>} />
        <Route path = '/Orders' element = {<Orders/>} />
        <Route path = '/transfer' element = {<Transfer/>} />
        <Route path = '/inventory/lowstock' element = {<LowStock/>} />
      </Routes>
  );
};

export default App