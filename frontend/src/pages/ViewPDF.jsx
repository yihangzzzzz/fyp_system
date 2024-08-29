
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ViewPDF = () => {

    const [pdfUrl, setPdfUrl] = useState('');
    const { fileName } = useParams();

    useEffect(() => {
      setPdfUrl(`http://localhost:3000/orders/pdf/${encodeURIComponent(fileName)}`);
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

export default ViewPDF