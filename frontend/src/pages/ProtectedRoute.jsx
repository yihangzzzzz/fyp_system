import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Navigate} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {

    const location = useLocation();
    const navigate = useNavigate();
    const db = new URLSearchParams(location.search).get('db');


    const token = localStorage.getItem('token');

    const redirectLogin = () => {
        navigate(`/login?db=${db}`);
    }

    console.log("token is ", token)

    if (!token) {
        console.log("this got run")
        return <Navigate to={`/login?db=${db}`} />;
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            return <Navigate to={`/login?db=${db}`} />;
        }
        return children;
    } catch (err) {
        return <Navigate to={`/login?db=${db}`} />;
    }
};

export default ProtectedRoute;
