import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username"); // clear user session
    navigate("/"); // redirect to launch/home page
  };

  if (!username) return null; // hide header if not logged in

  return (
    <header
      style={{
        background: "#6a5acd",
        padding: "15px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 style={{ margin: 0 }}>My App</h2>
      <nav style={{ display: "flex", alignItems: "center" }}>
        <Link to="/dashboard" style={{ margin: "0 15px", color: "white" }}>
          Dashboard
        </Link>
        <Link to="/profile" style={{ margin: "0 15px", color: "white" }}>
          Profile
        </Link>
        <Link to="/settings" style={{ margin: "0 15px", color: "white" }}>
          Settings
        </Link>
        <Link to="/results" style={{ margin: "0 15px", color: "white" }}>
          Test Result
        </Link>

        {/* Show logged in username */}
        <span style={{ marginLeft: "20px", fontWeight: "bold" }}>
          Hi, {username}
        </span>

        <button
          onClick={handleLogout}
          style={{
            marginLeft: "20px",
            background: "white",
            color: "#6a5acd",
            border: "none",
            padding: "6px 12px",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Header;
