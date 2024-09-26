import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';

const Users = () => {

    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        console.log("fetch got run");
        await axios
        .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/login`)
        .then((res) => {
            console.log("dataset are", res.data.recordset);
            setUsers(res.data.recordset);
            console.log("users are", users);
            setLoading(false);
        })
        .catch((error) => {
            console.log("le error is " + error);
            setLoading(false);
        });
    };

    const filteredInventory = users;


    return (
        <div>
            <Navbar/>
            <div className='topbar'>
                <h1 className='title'>User Management</h1>
            </div>
            <div className='inventory_table'>
        	    <table className='inventory-table'>
                    <thead>
                        <tr>
                            <th style={{ fontWeight: 'bold' }}>Username</th> 
                            <th style={{ fontWeight: 'bold' }}>Password</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInventory.map((item, index) => (
                            <tr key={index}>
                                <td>{item.username}</td>
                                <td>{item.password}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Users