import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineAddBox, MdModeEditOutline, MdDelete } from 'react-icons/md';
import Navbar from '../components/navbar.jsx';
import Modal from '../components/modal.jsx';
import Actions from '../components/actions.jsx';



const Users = () => {

    const location = useLocation();
    const db = new URLSearchParams(location.search).get('db');
    const [users, setUsers] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editUsername, setEditUsername] = useState('');


    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        await axios
        .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/login_be?db=${db}`)
        .then((res) => {
            setUsers(res.data.recordset);
        })
        .catch((error) => {
            console.log("le error is " + error);
        });
    };

    const handleAddUser = async (e) => {
        await axios
        .post(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/login_be/newuser?db=${db}`, e);
        setIsModalOpen(false)
        fetchUsers();
        console.log("added user", e)
    }

    const handleDelete = (username) => {
        axios
        .delete(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/login_be/${encodeURIComponent(username)}?db=${db}`)
        .catch((error) => {
        console.log("Error deleting item: " + error);
        });
        setIsConfirmationOpen(false);
        navigate(`/users?db=${db}`);
    }

    const handleEditUser = (username) => {
        axios
        .put(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/login_be/${encodeURIComponent(username)}?db=${db}`)
    }



    return (
        <div>
            <Navbar/>
            <div className='topbar'>
                <h1 className='title'>User Management</h1>
            </div>
            <button onClick={() => {setIsAddModalOpen(true)}} className='acknowledgeButton'>
                Add User
            </button>
            <div className='inventory_table'>
        	    <table className='inventory-table'>
                    <thead>
                        <tr>
                            <th className='table-header-title' style={{ fontWeight: 'bold' }}>Username</th> 
                            <th className='table-header-title' style={{ fontWeight: 'bold' }}>Password</th>
                            <th className='table-header-title' style={{ fontWeight: 'bold' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='inventory-table-body'>
                        {users.map((item, index) => (
                            <tr key={index}>
                                {}
                                <td>{item.username}</td>
                                <td>{item.password}</td>
                                <td className='user_actions'>                                    
                                    <MdModeEditOutline 
                                        title='Edit'
                                        onClick={() => {setIsEditModalOpen(true); setEditUsername(item.username);}}
                                        />
                                    <MdDelete
                                        title='Delete'undefined
                                        onClick={() => {handleDelete(item.username)}}
                                        />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
            isOpen={isAddModalOpen}
            onSubmit={(e) => handleAddUser(e)}
            onCancel={() => {setIsAddModalOpen(false)}}
            />

            <Modal
            isOpen={isEditModalOpen}
            onSubmit={(e) => handleEditUser(e)}
            onCancel={() => {setIsEditModalOpen(false)}}
            editUsername={editUsername}/>
        </div>
    )
}

export default Users