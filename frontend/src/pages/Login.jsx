// const axios = require('axios');
// const React = require('react');
// const { useEffect, useState } = React;
// const { useNavigate } = require('react-router-dom');

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorVisible, setErrorVisible] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await axios.post(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/login`, {
          user,
          password,
        });
  
        if (response.data.success) {
          // Handle successful login (e.g., redirect to dashboard)
        //   alert('Login Successful!');
          navigate('/home');
          setUser('');
          setPassword('');

        }
      } catch (error) {
        setErrorVisible(true);
        setErrorMessage('Invalid username or password');
      }
    };
  
    return (
      <div className='login-body'>
        <form className='login-form' onSubmit={handleSubmit}>
          <div className='login-form-div'>
            <label className='login-form-label'>Username:</label>
            <input className='login-form-input'
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>
          <div className='login-form-div'>
            <label className='login-form-label'>Password:</label>
            <input className='login-form-input'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className='login-form-button' type="submit">Login</button>
        </form>
        <div className={`login-form-error-message ${errorVisible ? 'active' : ''}`}>
            {errorMessage}
        </div>
        {/* {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} */}
      </div>
    )
}

// module.exports = Login
export default Login