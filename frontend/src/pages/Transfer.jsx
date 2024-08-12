import React, { useEffect, useState } from 'react'
import axios from "axios"
import Modal from '../components/modal';
import Navbar from '../components/navbar';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';

const Transfer = () => {

    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
        <Navbar />
        <div className='topbar'>
                <h1 className="title">Transfer Records</h1>
                {/* <MdOutlineAddBox className='addButton' /> */}
                {/* <MdOutlineAddBox className='addButton' onClick={() => setIsModalOpen(true)} /> */}
            </div>
    </div>
   
  )
}

export default Transfer