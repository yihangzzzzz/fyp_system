import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";

const AcceptTransfer = () => {
  const location = useLocation();
  const db = new URLSearchParams(location.search).get("db");
  const type = new URLSearchParams(location.search).get("type");

  const { transferID } = useParams();
  const [lab, setLab] = useState();

  useEffect(() => {
    if (db === "sw") {
      setLab("Software Project Lab");
    } else {
      setLab("Hardware Project Lab");
    }
    axios.put(
      `${window.location.protocol}//${window.location.hostname}:${window.location.port}/transfers_be/accepttransfer/${transferID}?db=${db}&type=${type}`
    );
  }, []);

  return (
    <div>
      <div className="navbar">
        <div className="navbar_logo">
          <img
            className="navbar_picture"
            src={`${window.location.protocol}//${window.location.hostname}:${window.location.port}/documents/ntu_ccds_logo_final.png`}
            alt="Logo"
          />
        </div>
      </div>
      <div className="topbar">
        <h1 className="title">Your transfer has been accepted</h1>
        <br></br>
        <h2 className="user_management_title">
          Please contact {lab} for more details
        </h2>
      </div>
    </div>
  );
};

export default AcceptTransfer;
