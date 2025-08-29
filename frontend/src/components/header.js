import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const accessToken = localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    if (accessToken) {
      navigate("/dashboard");
    } else {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

          :root {
            --primary-color: #4f46e5;
            --secondary-color: #10b981;
            --light-gray: #f3f4f6;
            --dark-gray: #4b5563;
            --text-color: #1f2937;
            --white: #ffffff;
            --border-radius: 8px;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 5%;
            background-color: var(--white);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            width: 100%;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
          }

          .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-color);
            cursor: pointer;
            border: none;
            background: none;
          }

          .nav-buttons {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .nav-links-wrapper {
            display: flex;
            align-items: center;
            gap: 1.5rem;
          }

          .nav-link {
            text-decoration: none;
            color: var(--dark-gray);
            font-weight: 600;
            padding: 0.6rem 1.2rem;
            border-radius: var(--border-radius);
            transition: background-color 0.3s ease, color 0.3s ease;
          }
          
          .nav-link:hover {
            background-color: var(--light-gray);
          }

          .logout-btn {
            text-decoration: none;
            padding: 0.6rem 1.2rem;
            border-radius: var(--border-radius);
            font-weight: 600;
            transition: all 0.3s ease;
            background-color: #ef4444;
            color: var(--white);
            border: none;
            cursor: pointer;
          }

          .logout-btn:hover {
            background-color: #dc2626;
          }

          .user-greeting {
            font-size: 0.9rem;
            color: var(--dark-gray);
            font-weight: 400;
            margin-right: 1.5rem;
          }
          
          @media (max-width: 768px) {
            .user-greeting {
              display: none;
            }
          }
        `}
      </style>
      <header className="header">
        <button
          onClick={handleDashboardClick}
          className="logo"
        >
          ExamPortal
        </button>

        <nav className="nav-buttons">
          <span className="user-greeting">
            Welcome, {username}
          </span>
          <div className="nav-links-wrapper">
            <Link
              to="/profile"
              className="nav-link"
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className="nav-link"
            >
              Settings
            </Link>
            <Link
              to="/results"
              className="nav-link"
            >
              Test Results
            </Link>
            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
