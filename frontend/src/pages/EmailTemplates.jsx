import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import Confirmation from "../components/confirmation.jsx";

const EmailTemplates = () => {
  const location = useLocation();
  const db = new URLSearchParams(location.search).get("db");
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState("Transfer");
  const [currentTemplate, setCurrentTemplate] = useState({});
  const [transferTemplate, setTransferTemplate] = useState({});
  const [financeTemplate, setFinanceTemplate] = useState({});
  const [lowStockTemplate, setLowStockTemplate] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    fetchEmailTemplates();
  }, [location.search]);

  const fetchEmailTemplates = async () => {
    await axios
      .get(
        `${window.location.protocol}//${window.location.hostname}:${window.location.port}/login_be/emailtemplates?db=${db}`
      )
      .then((res) => {
        setTransferTemplate(
          res.data.recordset.find((item) => item.templateName === "transfer")
        );
        setFinanceTemplate(
          res.data.recordset.find((item) => item.templateName === "finance")
        );
        setLowStockTemplate(
          res.data.recordset.find((item) => item.templateName === "lowStock")
        );
        setCurrentTemplate(
          res.data.recordset.find((item) => item.templateName === "transfer")
        );
      })
      .catch((error) => {
        console.log("le error is " + error);
      });
  };

  const handleTemplateChange = async (value, currentMode, field) => {
    if (currentMode === "Transfer") {
      setTransferTemplate((prevtemplate) => ({
        ...prevtemplate,
        [field]: value,
      }));
    } else if (currentMode === "Low Stock") {
      setLowStockTemplate((prevtemplate) => ({
        ...prevtemplate,
        [field]: value,
      }));
    } else {
      setFinanceTemplate((prevtemplate) => ({
        ...prevtemplate,
        [field]: value,
      }));
    }
    setCurrentTemplate((prevtemplate) => ({
      ...prevtemplate,
      [field]: value,
    }));
  };

  const handleSubmitEmailTemplates = async () => {
    console.log("wtf");
    setIsConfirmationOpen(false);
    try {
      await axios
        .put(
          `${window.location.protocol}//${window.location.hostname}:${window.location.port}/login_be/editemailtemplates?db=${db}`,
          {
            transferTemplate,
            financeTemplate,
            lowStockTemplate,
          }
        )
        .then((res) => {
          alert(`Tempaltes successfully saved!`);
          console.log("success run");
        });
    } catch (err) {
      console.log("fail run");
      console.error("Error editing email templates:", err);
    }
  };

  const handleAlertToggle = async () => {
    setToggle(!toggle);
    await axios.put(
      `${window.location.protocol}//${window.location.hostname}:${window.location.port}/login_be/togglealert?db=${db}`,
      toggle
    );
  };

  return (
    <div>
      <Navbar />
      <div className="topbar">
        <h1 className="title">Email Templates</h1>
      </div>
      <div className="email-templates-mode">
        <button
          className={`transfer-table-mode-button ${
            currentMode === "Transfer" ? "selected" : ""
          }`}
          onClick={() => {
            setCurrentTemplate(transferTemplate);
            setCurrentMode("Transfer");
          }}
        >
          Transfer
        </button>
        <button
          className={`transfer-table-mode-button ${
            currentMode === "Finance" ? "selected" : ""
          }`}
          onClick={() => {
            setCurrentTemplate(financeTemplate);
            setCurrentMode("Finance");
          }}
        >
          Finance
        </button>
        <button
          className={`transfer-table-mode-button ${
            currentMode === "Low Stock" ? "selected" : ""
          }`}
          onClick={() => {
            setCurrentTemplate(lowStockTemplate);
            setCurrentMode("Low Stock");
          }}
        >
          Low Stock
        </button>
      </div>

      <div className="order_table">
        <h2 style={{ fontSize: "x-large" }}>{currentMode}</h2>
        <div className="input-box">
          <h5>Subject</h5>
          <textarea
            className="email-template_input"
            type="text"
            value={currentTemplate.subject}
            onChange={(e) =>
              handleTemplateChange(e.target.value, currentMode, "subject")
            }
          />
        </div>
        <div className="input-box">
          <h5>Body</h5>
          <textarea
            className="email-template_input"
            type="text"
            value={currentTemplate.message}
            onChange={(e) =>
              handleTemplateChange(e.target.value, currentMode, "message")
            }
          />
        </div>
        {currentMode != "Transfer" && (
          <div className="input-box">
            <h5>Email</h5>
            <textarea
              className="email-template_input"
              type="text"
              value={currentTemplate.email}
              onChange={(e) =>
                handleTemplateChange(e.target.value, currentMode, "email")
              }
              onBlur={(e) => {
                const email = e.target.value;
                if (checkEmail(email)) {
                  return;
                } else {
                  alert(`Please enter valid email`);
                }
              }}
            />
          </div>
        )}
        {currentMode === "Low Stock" && (
          <div className="input-box">
            <h5>Weekly Schedule</h5>
            <select
              className="email-template_input"
              value={currentTemplate.day}
              required
              onChange={(e) =>
                handleTemplateChange(e.target.value, currentMode, "day")
              }
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>

            <input
              className="email-template_input"
              type="time"
              value={currentTemplate.time}
              onChange={(e) =>
                handleTemplateChange(e.target.value, currentMode, "time")
              }
              required
            />
          </div>
        )}
      </div>

      <button
        className="submit-button"
        type="submit"
        onClick={() => setIsConfirmationOpen(true)}
      >
        Save
      </button>

      <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleSubmitEmailTemplates}
        message={"Confirm to Save email templates?"}
      />
    </div>
  );
};

export default EmailTemplates;
