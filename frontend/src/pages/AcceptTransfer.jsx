const React = require('react');
const { useEffect, useState } = React;
const { useParams } = require('react-router-dom');
const axios = require('axios');

const AcceptTransfer = () => {

    const { transferID } = useParams();

    useEffect(() => {
        axios
        .put(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/transfers/accepttransfer/${transferID}`)
    }, []);

    return (
        <div>
            <div className='topbar'>
                <h1 className="title">Transfer Accepted!!!</h1>
            </div>
        </div>
    )
}

module.exports = AcceptTransfer;