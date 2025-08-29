import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
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
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("username", response.data.username);

      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid var(--medium-gray);
          border-radius: var(--border-radius);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          box-sizing: border-box;
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
        .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            width: 1.5rem;
            height: 1.5rem;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

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
            <h1>Welcome Back!</h1>
            <p>Log in to your account to continue your journey and access all features.</p>
            <Link to="/" style={{color: 'white', marginTop: '1.5rem', fontWeight: '600'}}>&larr; Back to Home</Link>
          </div>

          <div className="right-panel">
            <div className="form-header">
              <h2>Log In to Your Account</h2>
              <p>Enter your credentials below.</p>
            </div>
            
            {error && <div className="message error-message">{error}</div>}
            
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

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <div className="spinner"></div> : 'Login'}
              </button>
            </form>
            
            <p className="form-footer">
              Don't have an account?{" "}
              <Link to="/register">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
