import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import Modal from '../components/modal.jsx';
import Actions from '../components/actions.jsx';
import Confirmation from '../components/confirmation.jsx';
import {checkEmail} from '../functions/checkEmail.jsx';



const EmailTemplates = () => {

    const location = useLocation();
    const db = new URLSearchParams(location.search).get('db');
    const [currentMode, setCurrentMode] = useState('Transfer');
    const [currentTemplate, setCurrentTemplate] = useState({});
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
            setTransferTemplate(res.data.recordset.find(item => item.templateName === "transfer"));
            setFinanceTemplate(res.data.recordset.find(item => item.templateName === "finance"));
            setLowStockTemplate(res.data.recordset.find(item => item.templateName === "lowStock"));
            setCurrentTemplate(res.data.recordset.find(item => item.templateName === "transfer"));
        })
        .catch((error) => {
            console.log("le error is " + error);
        });
    };

    const handleTemplateChange = async (value, currentMode, field) => {
        if (currentMode === 'Transfer') {
            setTransferTemplate(prevtemplate => ({
                ...prevtemplate,
                [field]: value
            }))

        }
        else if (currentMode === 'Low Stock') {
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
        setCurrentTemplate(prevtemplate => ({
            ...prevtemplate,
            [field]: value
        }))
    }

    const handleSubmitEmailTemplates = async () => {
        setIsConfirmationOpen(false);
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
        window.location.reload();
        
    }

    return (
        <div>
            <Navbar/>
            <div className='topbar'>
                <h1 className='title'>Email Templates</h1>
            </div>
            <div className='email-templates-mode'>
                  <button className={`transfer-table-mode-button ${currentMode === 'Transfer' ? 'selected' : ''}`} onClick={() => {setCurrentTemplate(transferTemplate);setCurrentMode('Transfer');}}>Transfer</button>
                  <button className={`transfer-table-mode-button ${currentMode === 'Finance' ? 'selected' : ''}`} onClick={() => {setCurrentTemplate(financeTemplate);setCurrentMode('Finance');}}>Finance</button>
                  <button className={`transfer-table-mode-button ${currentMode === 'Low Stock' ? 'selected' : ''}`} onClick={() => {setCurrentTemplate(lowStockTemplate);setCurrentMode('Low Stock');}}>Low Stock</button>
            </div>
  
            <div className='order_table'>
                <h2 style={{fontSize: 'x-large'}}>
                    {currentMode}
                </h2>
                <div className='input-box'>
                    <h5>Subject</h5>
                    <textarea
                        type="text"
                        value={currentTemplate.subject}
                        onChange={(e) => handleTemplateChange(e.target.value, currentMode, 'subject')}
                        style={{ outline: '2px solid black', width: '500px' }} 
                    />
                </div>
                <div className='input-box'>
                    <h5>Body</h5>
                    <textarea
                        type="text"
                        value={currentTemplate.message}
                        onChange={(e) => handleTemplateChange(e.target.value, currentMode, 'message')}
                        style={{ outline: '2px solid black', width: '500px' }} 
                    />
                </div>
                {currentMode != 'Transfer' && (
                <div className='input-box'>
                    <h5>Email</h5>
                    <textarea
                        type="text"
                        value={currentTemplate.email}
                        onChange={(e) => handleTemplateChange(e.target.value, currentMode, 'email')}
                        style={{ outline: '2px solid black', width: '500px' }} 
                        onBlur={(e) => {
                            const email = e.target.value;
                            if (checkEmail(email)) {
                              return
                            }
                            else {
                              alert(`Please enter valid email`);
                            }
                          }}
                    />
                </div>
                )}
            </div>

            
            {/* <div className='order_table'>
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
            </div> */}

            <button className="submit-button" type="submit" onClick={() => setIsConfirmationOpen(true)}>Submit</button>
            <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleSubmitEmailTemplates}
        message={"Confirm to Save email templates?"}/>
        </div>
    )
}

export default EmailTemplates