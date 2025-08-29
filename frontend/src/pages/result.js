import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

function ResultPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }
    setMessage("Fetching your exam results...");
    axios
      .get("http://127.0.0.1:8000/api/results/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setResult(res.data);
        setLoading(false);
        setMessage("");
      })
      .catch((err) => {
        console.error("Failed to fetch results:", err);
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          setError(err.response?.data?.error || "Failed to fetch results.");
          setLoading(false);
          setMessage("Failed to fetch results. Please try again.");
        }
      });
  }, [accessToken, navigate]);

  if (loading) return <p>Loading results...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!result) return <p>No results found.</p>;

  const { username, total_score, answers, submitted_at } = result;

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

          .result-container {
            font-family: 'Poppins', sans-serif;
            min-height: calc(100vh - 74px);
            background-color: var(--light-gray);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
          }

          .result-card {
            background-color: var(--white);
            padding: 2rem;
            border-radius: var(--border-radius);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            max-width: 700px;
            width: 100%;
            text-align: center;
          }
          
          .result-title {
            font-size: 2.2rem;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
          }

          .result-subtitle {
            font-size: 1rem;
            color: var(--dark-gray);
            margin-bottom: 2rem;
          }

          .result-summary {
            background-color: var(--light-gray);
            border-radius: var(--border-radius);
            padding: 1.5rem;
            text-align: left;
            margin-bottom: 2rem;
          }

          .result-summary p {
            font-size: 1.1rem;
            color: var(--dark-gray);
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
          }

          .result-summary strong {
            font-weight: 600;
            color: var(--text-color);
          }
          
          .answers-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .answer-item {
            display: flex;
            flex-direction: column;
            padding: 1rem;
            border-bottom: 1px solid #e5e7eb;
            text-align: left;
          }
          
          .answer-item:last-child {
            border-bottom: none;
          }

          .answer-item strong {
            font-size: 1.1rem;
            color: var(--primary-color);
          }

          .answer-text {
            color: var(--dark-gray);
            margin-top: 0.5rem;
          }
          
          .message {
            color: var(--primary-color);
            margin-top: 1rem;
            font-size: 0.9rem;
            font-style: italic;
          }
        `}
      </style>
      <Header />
      <div className="result-container">
        <div className="result-card">
          <h1 className="result-title">Exam Result</h1>
          <p className="result-subtitle">Here are the details of your latest exam submission.</p>

          <div className="result-summary">
            <p><strong>Username:</strong> <span>{username}</span></p>
            <p><strong>Total Score:</strong> <span>{total_score}</span></p>
            <p><strong>Submitted At:</strong> <span>{new Date(submitted_at).toLocaleString()}</span></p>
          </div>

          <div className="answers-section">
            <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-color)" }}>Your Answers</h3>
            <ul className="answers-list">
              {answers && Object.keys(answers).map((qid) => (
                <li key={qid} className="answer-item">
                  <strong>Question {qid}:</strong>
                  <span className="answer-text">{answers[qid]}</span>
                </li>
              ))}
            </ul>
          </div>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </>
  );
}

export default ResultPage;
