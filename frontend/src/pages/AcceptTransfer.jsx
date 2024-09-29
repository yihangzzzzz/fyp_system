// const React = require('react');
// const { useEffect, useState } = React;
// const { useParams } = require('react-router-dom');
// const axios = require('axios');

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const AcceptTransfer = () => {

    const { transferID } = useParams();

    useEffect(() => {
        axios
        .put(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/transfers_/accepttransfer/${transferID}`)
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