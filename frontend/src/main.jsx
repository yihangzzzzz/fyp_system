const React = require('react');
const ReactDOM = require('react-dom/client');
const App = require('./App'); // Ensure default export
require('./styles/index.css'); // No direct `require` for CSS in CommonJS; this will need to be handled by your build tool
const { BrowserRouter } = require('react-router-dom');

// This code needs to be executed in a browser environment with proper build tools
// ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  //   <BrowserRouter>
  //   <App />
  //   </BrowserRouter>
  // </React.StrictMode>
  // 
  // );


// ReactDOM.createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//     <App/>
//   </BrowserRouter>,
// )

// ReactDOM.render(
//   React.createElement(App), // Create the React element from the App component
//   document.getElementById('root') // Target the div with id 'root'
// );

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>
);