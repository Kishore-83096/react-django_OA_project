// src/pages/RegisterPage.js
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        setSuccess("User registered successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      // --- IMPROVED ERROR HANDLING LOGIC ---
      if (err.response && err.response.data) {
        // This logic now extracts and displays the direct error message from the backend,
        // such as "A user with that username already exists."
        const errors = err.response.data;
        const errorMessages = Object.values(errors) // Get arrays of messages
          .flat() // Flatten them into a single array
          .join(" "); // Join them into a single string
        setError(errorMessages || "An unexpected error occurred. Please try again.");
      } else {
        setError("Connection error. Please check your network and try again.");
      }
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      {/* CSS Styles are added directly in the component file */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

        :root {
          --primary-color: #4f46e5; /* Indigo */
          --primary-color-dark: #4338ca;
          --light-gray: #f3f4f6;
          --medium-gray: #e5e7eb;
          --dark-gray: #4b5563;
          --text-color: #1f2937;
          --white: #ffffff;
          --error-red: #ef4444;
          --success-green: #10b981;
          --border-radius: 8px;
        }

        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background-color: var(--light-gray);
        }

        .register-container {
          display: flex;
          min-height: 100vh;
          width: 100%;
          align-items: center;
          justify-content: center;
        }

        .register-card {
          display: flex;
          width: 100%;
          max-width: 900px;
          background-color: var(--white);
          border-radius: var(--border-radius);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin: 1rem;
        }

        /* Left decorative panel */
        .left-panel {
          background: linear-gradient(135deg, var(--primary-color), #818cf8);
          color: var(--white);
          padding: 3rem;
          width: 45%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .left-panel h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .left-panel p {
          font-size: 1rem;
          line-height: 1.6;
        }

        /* Right form panel */
        .right-panel {
          padding: 3rem;
          width: 55%;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-header h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-color);
        }

        .form-header p {
          color: var(--dark-gray);
        }
        
        /* Form styles */
        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--dark-gray);
        }

        .input-wrapper {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem; /* Add padding for icon */
          border: 1px solid var(--medium-gray);
          border-radius: var(--border-radius);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          box-sizing: border-box; /* Important for padding */
        }
        
        .form-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
        }
        
        .input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--dark-gray);
        }

        .submit-btn {
          width: 100%;
          padding: 0.8rem;
          border: none;
          background-color: var(--primary-color);
          color: var(--white);
          border-radius: var(--border-radius);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-btn:hover {
          background-color: var(--primary-color-dark);
        }
        
        .submit-btn:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .form-footer {
          text-align: center;
          margin-top: 1.5rem;
          color: var(--dark-gray);
        }
        
        .form-footer a {
          color: var(--primary-color);
          font-weight: 600;
          text-decoration: none;
        }
        
        .form-footer a:hover {
          text-decoration: underline;
        }
        
        /* Message styles */
        .message {
            padding: 0.75rem;
            border-radius: var(--border-radius);
            text-align: center;
            margin-bottom: 1rem;
            font-weight: 500;
        }
        .error-message {
            background-color: #fee2e2;
            color: #b91c1c;
        }
        .success-message {
            background-color: #d1fae5;
            color: #047857;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .register-card {
            flex-direction: column;
          }
          .left-panel, .right-panel {
            width: 100%;
            box-sizing: border-box;
          }
          .left-panel {
            padding: 2rem;
            text-align: center;
          }
           .right-panel {
            padding: 2rem;
          }
        }
      `}</style>
      
      <div className="register-container">
        <div className="register-card">
          <div className="left-panel">
            <h1>Join ExamPortal</h1>
            <p>Create an account to access exclusive exams, track your progress, and achieve your goals.</p>
             <Link to="/" style={{color: 'white', marginTop: '1.5rem', fontWeight: '600'}}>&larr; Back to Home</Link>
          </div>

          <div className="right-panel">
            <div className="form-header">
              <h2>Create an Account</h2>
              <p>Get started in just a few clicks!</p>
            </div>
            
            {error && <div className="message error-message">{error}</div>}
            {success && <div className="message success-message">{success}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                  </svg>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    placeholder="e.g., john_doe"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                 <div className="input-wrapper">
                    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                    </svg>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                 </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="input-wrapper">
                    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                    </svg>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="confirm_password">Confirm Password</label>
                <div className="input-wrapper">
                    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                    </svg>
                    <input
                      id="confirm_password"
                      type="password"
                      name="confirm_password"
                      placeholder="••••••••"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
            
            <p className="form-footer">
              Already have an account?{" "}
              <Link to="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;

