// const React = require('react');
// const ReactDOM = require('react-dom/client');
// const App = require('./App'); // Ensure default export
// require('./styles/index.css'); // No direct `require` for CSS in CommonJS; this will need to be handled by your build tool
// const { BrowserRouter } = require('react-router-dom');

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>
);