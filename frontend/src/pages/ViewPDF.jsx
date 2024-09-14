
const React = require('react');
const { useEffect, useState } = React;
const { useParams } = require('react-router-dom');

const ViewPDF = () => {

    const [pdfUrl, setPdfUrl] = useState('');
    const { fileName } = useParams();

    useEffect(() => {
      setPdfUrl(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/orders/pdf/${encodeURIComponent(fileName)}`);
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

module.exports = ViewPDF