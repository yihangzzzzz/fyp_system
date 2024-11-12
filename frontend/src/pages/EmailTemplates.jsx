import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import Modal from '../components/modal.jsx';
import Actions from '../components/actions.jsx';
import Confirmation from '../components/confirmation.jsx';



const EmailTemplates = () => {

    const location = useLocation();
    const db = new URLSearchParams(location.search).get('db');
    const [transferTemplate, setTransferTemplate] = useState({});
    const [financeTemplate, setFinanceTemplate] = useState({});
    const [lowStockTemplate, setLowStockTemplate] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    useEffect(() => {
        fetchEmailTemplates();
    }, []);

    const fetchEmailTemplates = async () => {
        await axios
        .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/login_be/emailtemplates?db=${db}`)
        .then((res) => {
            setTransferTemplate(res.data.recordset[0]);
            setFinanceTemplate(res.data.recordset[1]);
            setLowStockTemplate(res.data.recordset[2]);
        })
        .catch((error) => {
            console.log("le error is " + error);
        });
    };

    const handleTemplateChange = async (value, template, field) => {
        if (template === 'transfer') {
            setTransferTemplate(prevtemplate => ({
                ...prevtemplate,
                [field]: value
            }))
        }
        else if (template === 'lowStock') {
            setLowStockTemplate(prevtemplate => ({
                ...prevtemplate,
                [field]: value
            }))
        }
        else {
            setFinanceTemplate(prevtemplate => ({
                ...prevtemplate,
                [field]: value
            }))
        }
    }

    const handleSubmitEmailTemplates = async () => {
        try {
            await axios
            .put(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/login_be/editemailtemplates?db=${db}`, {
                transferTemplate,
                financeTemplate,
                lowStockTemplate
            })
        } catch (err) {
            console.error("Error editing email templates:", err)
        }
        setIsConfirmationOpen(false);
    }

    return (
        <div>
            <Navbar/>
            <div className='topbar'>
                <h1 className='title'>Email Templates</h1>
            </div>
  
            <div className='order_table'>
                <h2 style={{fontSize: 'x-large'}}>
                    Transfer
                </h2>
                <div className='input-box'>
                    <h5>Subject</h5>
                    <textarea
                        type="text"
                        value={transferTemplate.subject}
                        onChange={(e) => handleTemplateChange(e.target.value, 'transfer', 'subject')}
                        style={{ outline: '2px solid black', width: '500px' }} 
                    />
                </div>
                <div className='input-box'>
                    <h5>Body</h5>
                    <textarea
                        type="text"
                        value={transferTemplate.message}
                        onChange={(e) => handleTemplateChange(e.target.value, 'transfer', 'message')}
                        style={{ outline: '2px solid black', width: '500px' }} 
                    />
                </div>
            </div>

            
            <div className='order_table'>
                <h2 style={{fontSize: 'x-large'}}>
                    DO Delivery to Finance
                </h2>
                <div className='input-box'>
                    <h5>Subject</h5>
                    <textarea
                        type="text"
                        value={financeTemplate.subject}
                        onChange={(e) => handleTemplateChange(e.target.value, 'finance', 'subject')}
                        style={{ outline: '2px solid black', width: '500px' }} 
                    />
                </div>
                <div className='input-box'>
                    <h5>Body</h5>
                    <textarea
                        type="text"
                        value={financeTemplate.message}
                        onChange={(e) => handleTemplateChange(e.target.value, 'finance', 'message')}
                        style={{ outline: '2px solid black', width: '500px' }} 
                    />
                </div>
                <div className='input-box'>
                    <h5>Email</h5>
                    <textarea
                        type="text"
                        value={financeTemplate.email}
                        onChange={(e) => handleTemplateChange(e.target.value, 'finance', 'email')}
                        style={{ outline: '2px solid black', width: '500px' }} 
                    />
                </div>
            </div>

            <div className='order_table'>
                <h2 style={{fontSize: 'x-large'}}>
                    Weekly Low Stock Alert
                </h2>
                <div className='input-box'>
                    <h5>Subject</h5>
                    <textarea
                        type="text"
                        value={lowStockTemplate.subject}
                        onChange={(e) => handleTemplateChange(e.target.value, 'lowStock', 'subject')}
                        style={{ outline: '2px solid black', width: '500px' }} 
                    />
                </div>
                <div className='input-box'>
                    <h5>Body</h5>
                    <textarea
                        type="text"
                        value={lowStockTemplate.message}
                        onChange={(e) => handleTemplateChange(e.target.value, 'lowStock', 'message')}
                        style={{ outline: '2px solid black', width: '500px' }} 
                    />
                </div>
                <div className='input-box'>
                    <h5>Email</h5>
                    <textarea
                        type="text"
                        value={lowStockTemplate.email}
                        onChange={(e) => handleTemplateChange(e.target.value, 'lowStock', 'email')}
                        style={{ outline: '2px solid black', width: '500px' }} 
                    />
                </div>
            </div>

            <button className="submit-button" type="submit" onClick={() => setIsConfirmationOpen(true)}>Submit</button>
            <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleSubmitEmailTemplates}/>
        </div>
    )
}

export default EmailTemplates