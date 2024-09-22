
// const React = require('react');
// const { useEffect, useState } = React;
// const { useParams } = require('react-router-dom');

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


const ViewPDF = () => {

    const [pdfUrl, setPdfUrl] = useState('');
    const { fileName } = useParams();

    useEffect(() => {
      setPdfUrl(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/orders/pdf/${encodeURIComponent(fileName)}`);
    }, []);

    return (
        <div className="fullscreen-container">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="fullscreen-iframe"
            />
          ) : (
            <p>Loading PDF...</p>
          )}
        </div>
      );
}

// module.exports = ViewPDF
export default ViewPDF;