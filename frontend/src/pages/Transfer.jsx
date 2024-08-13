import React, { useState } from 'react';
import Navbar from '../components/navbar';

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
            <body>
              <header class="topbar">
                  <div class="topbar-section" onclick="selectSection('home')">Home</div>
                  <div class="topbar-section" onclick="selectSection('about')">About</div>
                  <div class="topbar-section" onclick="selectSection('services')">Services</div>
                  <div class="topbar-section" onclick="selectSection('contact')">Contact</div>
              </header>

    <script src="scripts.js"></script>
</body>
    </div>
   
  )
}

export default Transfer