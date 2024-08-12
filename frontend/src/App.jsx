import React from 'react'
import { Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Inventory from './pages/Inventory'
import PO from './pages/PO'
import Transfer from './pages/Transfer'
import './index.css'

export const App = () => {
  return (
      <Routes>
        <Route path = '/' element = {<Home/>} />
        <Route path = '/inventory' element = {<Inventory/>} />
        <Route path = '/PO' element = {<PO/>} />
        <Route path = '/transfer' element = {<Transfer/>} />
      </Routes>
  );
};

export default App