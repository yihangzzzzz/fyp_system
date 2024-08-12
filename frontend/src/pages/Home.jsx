import React, { useEffect, useState } from 'react'
import Inventory from './Inventory';
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar';

const Home  = () => {

  const [msg, setMsg] = useState('step1');

  const navigate = useNavigate();
  const gotoInvnetory = () => {
    navigate('/inventory');
  }

  useEffect(() => {
    // setMsg('step2');
  }, []);

  return (
    <div>
        <Navbar />
        <h1 className='home_title'>Inventory Management System</h1>
        <button onClick={gotoInvnetory}>View Inventory</button>
        <h2>{msg}</h2>
    </div>
  )
}

export default Home 