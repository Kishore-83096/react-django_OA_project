// src/pages/WelcomePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function WelcomePage() {
  const [data, setData] = useState({ message: "", info: "" });

  // --- No changes to the backend logic ---
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/welcome/") // your Django backend endpoint
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching welcome data:", error);
        // Set fallback data in case of an error to keep the UI consistent
        setData({
          message: "Welcome to ExamPortal",
          info: "Your one-stop solution for online examinations."
        });
      });
  }, []);

  // --- Fake template data for demonstration purposes ---
  const fakeExams = [
    { id: 1, title: "Mathematics Aptitude", questions: 50, duration: "60 mins" },
    { id: 2, title: "General Science Quiz", questions: 30, duration: "30 mins" },
    { id: 3, title: "History Challenge", questions: 40, duration: "45 mins" },
  ];

  return (
    <>
      {/* CSS Styles are added directly in the component file */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

        :root {
          --primary-color: #4f46e5; /* Indigo */
          --secondary-color: #10b981; /* Emerald */
          --light-gray: #f3f4f6;
          --dark-gray: #4b5563;
          --text-color: #1f2937;
          --white: #ffffff;
          --border-radius: 8px;
        }

        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background-color: var(--light-gray);
          color: var(--text-color);
        }

        .welcome-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* Header Styles */
        .welcome-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 5%;
          background-color: var(--white);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          width: 100%;
          box-sizing: border-box;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .nav-buttons a {
          text-decoration: none;
          padding: 0.6rem 1.2rem;
          margin-left: 0.5rem;
          border-radius: var(--border-radius);
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-register {
          background-color: var(--primary-color);
          color: var(--white);
        }
        .btn-register:hover {
          background-color: #4338ca; /* Darker Indigo */
        }

        .btn-login {
          background-color: var(--light-gray);
          color: var(--dark-gray);
        }
        .btn-login:hover {
          background-color: #e5e7eb; /* Darker Gray */
        }

        /* Main Content Styles */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3rem 1rem;
          text-align: center;
        }

        .hero-section {
          max-width: 700px;
          margin-bottom: 3rem;
        }

        .hero-title {
          font-size: 2.8rem;
          font-weight: 700;
          color: var(--text-color);
          margin-bottom: 1rem;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--dark-gray);
          max-width: 500px;
          margin: 0 auto;
        }

        /* Featured Exams Section */
        .featured-exams {
          width: 100%;
          max-width: 1000px;
        }

        .featured-exams h2 {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .disclaimer {
          color: #ef4444; /* Red */
          font-style: italic;
          margin-bottom: 2rem;
        }

        .exam-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .exam-card {
          background-color: var(--white);
          padding: 1.5rem;
          border-radius: var(--border-radius);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          text-align: left;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .exam-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
        }

        .exam-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--primary-color);
          margin-top: 0;
        }

        .exam-meta {
          display: flex;
          justify-content: space-between;
          color: var(--dark-gray);
          font-size: 0.9rem;
          margin-top: 1rem;
        }
      `}</style>
      
      <div className="welcome-container">
        <header className="welcome-header">
          <div className="logo">ExamPortal</div>
          <div className="nav-buttons">
            <Link to="/register" className="btn-register">Register</Link>
            <Link to="/login" className="btn-login">Login</Link>
          </div>
        </header>

        <main className="main-content">
          <section className="hero-section">
            <h1 className="hero-title">{data.message}</h1>
            <p className="hero-subtitle">{data.info}</p>
          </section>

          <section className="featured-exams">
            <h2>Explore Our Exams</h2>
            <p className="disclaimer">Note: The exams listed below are for demonstration purposes only.</p>
            <div className="exam-grid">
              {fakeExams.map(exam => (
                <div key={exam.id} className="exam-card">
                  <h3>{exam.title}</h3>
                  <p>Sharpen your skills with our comprehensive test.</p>
                  <div className="exam-meta">
                    <span><strong>Questions:</strong> {exam.questions}</span>
                    <span><strong>Duration:</strong> {exam.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default WelcomePage;