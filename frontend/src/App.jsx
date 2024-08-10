import React from 'react'
import { Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Inventory from './pages/Inventory'
import Add from './pages/Add'
import './index.css'

export const App = () => {
  return (
      <Routes>
        <Route path = '/' element = {<Home/>} />
        <Route path = '/inventory' element = {<Inventory/>} />
        <Route path = '/inventory/add' element = {<Add/>} />
      </Routes>
  );
};

export default App