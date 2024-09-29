// const React = require('react');
// const { useEffect, useState } = React;
// const { Link } = require('react-router-dom');
// const Navbar = require('../components/navbar');

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MainPage  = () => {

  return (
    <div className="button-container">
        <Link to="/login?db=sw" className="large-button">
            Software Project Lab
        </Link>
        <Link to="/login?db=hw" className="large-button">
            Hardware Project Lab
        </Link>
    </div>

  )
}


// module.exports = Home 
export default MainPage;