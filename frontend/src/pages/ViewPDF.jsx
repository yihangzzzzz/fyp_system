import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewPDF = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const { fileName } = useParams();

  useEffect(() => {
    setPdfUrl(
      `${window.location.protocol}//${window.location.hostname}:${
        window.location.port
      }/orders_be/pdf/${encodeURIComponent(fileName)}?db=${db}`
    );
  }, []);

  return (
    <div className="fullscreen-container">
      {pdfUrl ? (
        <iframe src={pdfUrl} className="fullscreen-iframe" />
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default ViewPDF;
