import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/dashboard/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        localStorage.setItem("username", res.data.username);
        setDashboardData(res.data);
      })
      .catch((err) => {
        console.error("Dashboard data fetch failed:", err);
        navigate("/login");
      });
  }, [navigate]);

  const handleStartExam = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    setMessage("Starting exam...");
    
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/exam/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.questions && res.data.questions.length > 0) {
        localStorage.setItem(
          "exam_timer",
          res.data.exam_settings["timer in minutes"] * 60
        );
        localStorage.setItem("exam_answers", JSON.stringify({}));
        localStorage.setItem("exam_current_index", 0);

        navigate("/exam");
      } else {
        setMessage("No questions available for this exam. Please try again later.");
      }
    } catch (err) {
      console.error("Failed to start exam:", err);
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        setMessage("Failed to start exam. Please check your connection.");
      }
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!dashboardData) {
    return <p>Loading...</p>;
  }

  const { exam_available, total_questions, total_marks, timer } = dashboardData;

  return (
    <>
      <style>
        {`
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

          .dashboard-container {
            font-family: 'Poppins', sans-serif;
            min-height: calc(100vh - 74px); /* Adjust based on header height */
            background-color: var(--light-gray);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
          }

          .dashboard-card {
            background-color: var(--white);
            padding: 2rem;
            border-radius: var(--border-radius);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            max-width: 600px;
            width: 100%;
            text-align: center;
          }

          .dashboard-title {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
          }
          
          .dashboard-subtitle {
            font-size: 1rem;
            color: var(--dark-gray);
            margin-bottom: 2rem;
          }

          .dashboard-info {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-top: 1.5rem;
            text-align: left;
            background-color: var(--light-gray);
            border-radius: var(--border-radius);
            padding: 1.5rem;
          }

          .info-item {
            font-size: 1.1rem;
            color: var(--dark-gray);
            display: flex;
            justify-content: space-between;
          }

          .info-item strong {
            font-weight: 600;
            color: var(--text-color);
          }

          .start-exam-btn {
            background-color: var(--primary-color);
            color: var(--white);
            padding: 1rem 2rem;
            border-radius: var(--border-radius);
            font-weight: 600;
            font-size: 1rem;
            width: 100%;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin-top: 2rem;
          }

          .start-exam-btn:hover {
            background-color: #4338ca;
          }

          .dashboard-message {
            color: var(--primary-color);
            margin-top: 1rem;
            font-size: 0.9rem;
            font-style: italic;
          }
        `}
      </style>
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Your central hub for exam management and information.</p>
          
          <div className="dashboard-info">
            <div className="info-item">
              <strong>Exam Available:</strong> <span>{exam_available ? "Yes" : "No"}</span>
            </div>
            <div className="info-item">
              <strong>Total Questions:</strong> <span>{total_questions}</span>
            </div>
            <div className="info-item">
              <strong>Total Marks:</strong> <span>{total_marks}</span>
            </div>
            <div className="info-item">
              <strong>Exam Timer:</strong> <span>{timer} minutes</span>
            </div>
          </div>
          
          {exam_available && (
            <button
              onClick={handleStartExam}
              className="start-exam-btn"
            >
              Start Exam
            </button>
          )}

          {message && <p className="dashboard-message">{message}</p>}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
