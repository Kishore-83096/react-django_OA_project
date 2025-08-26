import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function LoginPage({ onLogin }) { // Accept onLogin as a prop
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/api/login/", {
        username: usernameOrEmail, // backend accepts username OR email
        email: usernameOrEmail,
        password: password,
      })
      .then((res) => {
        alert("Login successful!");
        localStorage.setItem("username", res.data.username); // store login info
        if (onLogin) onLogin(); // notify App that user is logged in
        navigate("/dashboard"); // redirect to dashboard after login
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Login failed");
      });
  };

  return (
    <div className="login-container" style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{ display: "inline-block", textAlign: "left" }}>
        <div>
          <label>Username / Email:</label>
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
            style={{ display: "block", marginBottom: "10px", width: "250px" }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: "block", marginBottom: "10px", width: "250px" }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ width: "250px" }}>Login</button>
      </form>
      <p style={{ marginTop: "20px" }}>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
      <p>
        <Link to="/">Go Home</Link>
      </p>
    </div>
  );
}

export default LoginPage;
