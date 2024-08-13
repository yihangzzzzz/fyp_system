import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import Inventory from './pages/Inventory'
import Orders from './pages/Orders'
import Transfer from './pages/Transfer'

export const App = () => {
  return (
      <Routes>
        <Route path = '/' element = {<Home/>} />
        <Route path = '/inventory' element = {<Inventory/>} />
        <Route path = '/Orders' element = {<Orders/>} />
        <Route path = '/transfer' element = {<Transfer/>} />
      </Routes>
  );
};

export default App