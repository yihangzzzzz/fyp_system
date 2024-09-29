import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import Modal from '../components/modal.jsx';
import Actions from '../components/actions.jsx';



const EmailTemplates = () => {

    const location = useLocation();
    const db = new URLSearchParams(location.search).get('db');
    const [transferTemplate, setTransferTemplate] = useState({});
    const [financeTemplate, setFinanceTemplate] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchEmailTemplates();
    }, []);

    const fetchEmailTemplates = async () => {
        await axios
        .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/login_be/emailtemplates?db=${db}`)
        .then((res) => {
            setTransferTemplate(res.data.recordset[0]);
            setFinanceTemplate(res.data.recordset[1]);
        })
        .catch((error) => {
            console.log("le error is " + error);
        });
    };

    return (
        <div>
            <Navbar/>
            <div className='topbar'>
                <h1 className='title'>Email Templates</h1>
            </div>
            <h2>
                Transfer
            </h2>
            <div className='order_table'>
                <div className='input-box'>
                    <h5></h5>
                    <textarea
                        type="text"
                        value={transferTemplate.subject}
                        onChange={(e) => handleItemChange(e.target.value, 'description')}
                        style={{ outline: '2px solid black', width: '500px' }} 
                    />
                </div>
            </div>


        </div>
    )
}

export default EmailTemplates