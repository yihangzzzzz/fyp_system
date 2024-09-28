import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import Modal from '../components/modal.jsx';
import Actions from '../components/actions.jsx';


const Users = () => {

    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        await axios
        .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/login`)
        .then((res) => {
            setUsers(res.data.recordset);
        })
        .catch((error) => {
            console.log("le error is " + error);
        });
    };

    const handleAddUser = async (e) => {
        await axios
        .post(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/login/newuser`, e);
        setIsModalOpen(false)
        fetchUsers();
        console.log("added user", e)
    }



    return (
        <div>
            <Navbar/>
            <div className='topbar'>
                <h1 className='title'>User Management</h1>
            </div>
            <button onClick={() => {setIsModalOpen(true)}} className='acknowledgeButton'>
                Add User
            </button>
            <div className='inventory_table'>
        	    <table className='inventory-table'>
                    <thead>
                        <tr>
                            <th style={{ fontWeight: 'bold' }}>Username</th> 
                            <th style={{ fontWeight: 'bold' }}>Password</th>
                            <th style={{ fontWeight: 'bold' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((item, index) => (
                            <tr key={index}>
                                <td>{item.username}</td>
                                <td>{item.password}</td>
                                <td>                                    
                                    <Actions
                                    toDelete={item.username}
                                    toEdit={item.username}
                                    mode={'user'}/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
            isOpen={isModalOpen}
            onSubmit={(e) => handleAddUser(e)}
            onCancel={() => {setIsModalOpen(false)}}/>
        </div>
    )
}

export default Users