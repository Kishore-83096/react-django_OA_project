// src/components/Header.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username"); // Save username on login
  const accessToken = localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    navigate("/login"); // redirect to login page
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    if (accessToken) {
      navigate("/dashboard");
    } else {
      // Token missing or expired
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / App Name */}
        <button
          onClick={handleDashboardClick}
          className="text-xl font-bold bg-transparent border-none cursor-pointer"
        >
          Exam Portal
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-4">
          <span className="font-medium">Hello, {username}</span>
          <Link
            to="/profile"
            className="hover:bg-indigo-500 px-3 py-1 rounded transition"
          >
            Profile
          </Link>
          <Link
            to="/settings"
            className="hover:bg-indigo-500 px-3 py-1 rounded transition"
          >
            Settings
          </Link>
          <Link
            to="/results"
            className="hover:bg-indigo-500 px-3 py-1 rounded transition"
          >
            Test Results
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
