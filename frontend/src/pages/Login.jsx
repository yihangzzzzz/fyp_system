import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);

  const db = new URLSearchParams(location.search).get("db");

  useEffect(() => {}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${window.location.protocol}//${window.location.hostname}:${window.location.port}/login_be?db=${db}`,
        {
          user,
          password,
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        navigate(`/home?db=${db}`);
        setUser("");
        setPassword("");
      }
    } catch (error) {
      setErrorVisible(true);
      console.log(error);
      setErrorMessage("Invalid username or password");
    }
  };

  return (
    <div className="login-body">
      {db === "sw" ? (
        <h1 className="home-title">
          Software Project Lab Inventory Management System
        </h1>
      ) : (
        <h1 className="home-title">
          Hardware Project Lab Inventory Management System
        </h1>
      )}

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-form-div">
          <label className="login-form-label">Username:</label>
          <input
            className="login-form-input"
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>
        <div className="login-form-div">
          <label className="login-form-label">Password:</label>
          <input
            className="login-form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="login-form-button" type="submit">
          Login
        </button>
      </form>
      <div
        className={`login-form-error-message ${errorVisible ? "active" : ""}`}
      >
        {errorMessage}
      </div>
    </div>
  );
};

export default Login;
