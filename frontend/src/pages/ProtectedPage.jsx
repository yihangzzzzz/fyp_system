import React, { useEffect } from 'react';
// import { useHistory } from 'react-router-dom'; // Or 'useNavigate' if using React Router v6
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProtectedPage = () => {
    const history = useHistory(); // For navigation (use useNavigate for React Router v6)
    const navigate = useNavigate();

    useEffect(() => {
        // Make an API request to check if the user is authenticated
        axios.get('/api/check-auth')
            .then(response => {
                if (!response.data.loggedIn) {
                    // Redirect to login page if not authenticated
                    navigate('/login');
                }
            })
            .catch(err => {
                console.error('Error checking authentication', err);
            });
    }, []);

    return (
        <div>
            {/* Render your protected page content here */}
            <h1>This is a protected page</h1>
        </div>
    );
};

export default ProtectedPage;