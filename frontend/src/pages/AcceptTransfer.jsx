// const React = require('react');
// const { useEffect, useState } = React;
// const { useParams } = require('react-router-dom');
// const axios = require('axios');

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';


const AcceptTransfer = () => {
    const location = useLocation();
    const db = new URLSearchParams(location.search).get('db');
    const type = new URLSearchParams(location.search).get('type');


    const { transferID } = useParams();

    useEffect(() => {
        axios
        .put(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/transfers_be/accepttransfer/${transferID}?db=${db}&type=${type}`)
    }, []);

    return (
        <div>
            <div className='topbar'>
                <h1 className="title">Transfer Accepted!!!</h1>
            </div>
        </div>
    )
}

// module.exports = AcceptTransfer;
export default AcceptTransfer;