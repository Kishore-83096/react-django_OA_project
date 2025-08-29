import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

const AttemptModal = ({ attempt, onClose }) => {
  if (!attempt) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">Detailed Breakdown</h2>
        <p className="modal-subtitle">Attempt ID: {attempt.attempt_id}</p>

        <div className="answers-scroll-container">
          <ul className="answers-list">
            {attempt.question_attempts &&
              attempt.question_attempts.map((qa, idx) => (
                <li key={idx} className="answer-item-card">
                  <div className="answer-header">
                    <h3 className="question-text">
                      Q{idx + 1}: {qa.question}
                    </h3>
                    {qa.chosen_option === qa.correct_answer ? (
                      <span className="answer-status status-correct">✅ Correct</span>
                    ) : (
                      <span className="answer-status status-incorrect">❌ Incorrect</span>
                    )}
                  </div>
                  <p className="user-answer">
                    <strong>Your Answer:</strong>{" "}
                    <span
                      className={
                        qa.chosen_option === qa.correct_answer ? "text-green" : "text-red"
                      }
                    >
                      {qa.chosen_option}
                    </span>
                  </p>
                  <p className="correct-answer">
                    <strong>Correct Answer:</strong>{" "}
                    <span className="text-green">{qa.correct_answer}</span>
                  </p>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

function ResultPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/results/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setResults(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch results:", err);
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          setError(err.response?.data?.error || "Failed to fetch results.");
          setLoading(false);
        }
      });
  }, [accessToken, navigate]);

  const closeModal = () => setSelectedAttempt(null);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

          body {
            background-color: #f8f9fa;
          }

          .result-page-wrapper {
            font-family: 'Poppins', sans-serif;
            background-color: #f8f9fa;
            min-height: calc(100vh - 74px);
            padding: 3rem 1rem;
          }

          .page-title-container {
            max-width: 1200px;
            margin: 0 auto 2rem;
            text-align: center;
          }

          .page-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #212529;
            margin: 0;
            letter-spacing: -1px;
          }

          .result-grid-container {
            max-width: 1200px;
            margin: auto;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            justify-content: center;
          }

          .result-card {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #e9ecef;
            text-decoration: none;
            color: inherit;
          }
         
          .result-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
          }
         
          .card-header {
            background-color: #f1f3f5;
            padding: 1rem 1.5rem;
            text-align: center;
            border-bottom: 1px solid #dee2e6;
          }

          .card-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #495057;
            margin: 0;
          }
         
          .card-body {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            flex-grow: 1;
            justify-content: center;
          }
         
          .card-text-item {
              text-align: center;
          }

          .item-label {
              font-size: 0.875rem;
              font-weight: 500;
              color: #6c757d;
              margin: 0 0 0.25rem 0;
          }
         
          .item-value {
              font-size: 2rem;
              font-weight: 700;
              color: #28a745;
              line-height: 1;
              margin: 0;
          }

          .item-value.red {
            color: #dc3545;
          }

          .card-footer {
            padding: 0 1.5rem 1.5rem;
            text-align: center;
            font-size: 0.875rem;
            color: #6c757d;
          }

          .text-green { color: #28a745; font-weight: 600; }
          .text-red { color: #dc3545; font-weight: 600; }

          .loading-message, .error-message, .no-results-message {
            text-align: center;
            padding-top: 50vh;
            transform: translateY(-50%);
            font-size: 1.25rem;
            font-weight: 500;
            color: #4b5563;
          }

          .error-message {
            color: #dc2626;
          }

          /* Modal styles */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease-in-out;
          }

          .modal-content {
            background-color: #ffffff;
            padding: 2rem;
            border-radius: 12px;
            max-width: 800px;
            width: 90%;
            max-height: 80vh;
            height: 80vh;
            overflow: hidden;
            position: relative;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
            animation: slideIn 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            display: flex;
            flex-direction: column;
          }

          .modal-close-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 2rem;
            color: #adb5bd;
            cursor: pointer;
            transition: color 0.2s ease-in-out;
            z-index: 10;
          }

          .modal-close-btn:hover {
            color: #495057;
          }

          .modal-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #212529;
            margin-bottom: 0.5rem;
            text-align: center;
          }

          .modal-subtitle {
            font-size: 1rem;
            color: #6c757d;
            text-align: center;
            margin-bottom: 1rem;
          }

          .answers-scroll-container {
            overflow-y: auto;
            flex: 1;
            padding-right: 5px;
            margin-top: 1rem;
          }

          .answers-scroll-container::-webkit-scrollbar {
            width: 8px;
          }

          .answers-scroll-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }

          .answers-scroll-container::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
          }

          .answers-scroll-container::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }

          .answers-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .answer-item-card {
            background-color: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            border: 1px solid #e9ecef;
            margin-bottom: 1rem;
          }

          .answer-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.75rem;
          }

          .question-text {
            font-size: 1.125rem;
            font-weight: 600;
            color: #212529;
            margin: 0;
            flex: 1;
            margin-right: 1rem;
          }
         
          .answer-status {
            font-weight: 600;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.875rem;
            white-space: nowrap;
          }

          .status-correct {
            color: #15803d;
            background-color: #dcfce7;
          }

          .status-incorrect {
            color: #b91c1c;
            background-color: #fee2e2;
          }

          .user-answer, .correct-answer {
            font-size: 1rem;
            color: #495057;
            margin: 0.5rem 0;
          }

          .user-answer strong, .correct-answer strong {
            color: #212529;
          }
         
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
         
          @keyframes slideIn {
            from { transform: translateY(-50px); }
            to { transform: translateY(0); }
          }
        `}
      </style>

      <Header />
      <div className="result-page-wrapper">
        {loading ? (
          <p className="loading-message">Loading results...</p>
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : (
          <>
            <div className="page-title-container">
              <h1 className="page-title">Your Past Attempts</h1>
              <p className="page-subtitle">
                {results.length > 0
                  ? "Click on any card to see a detailed breakdown."
                  : "No results found."}
              </p>
            </div>

            <div className="result-grid-container">
              {results.length > 0 ? (
                results.map((attempt, index) => (
                  <div
                    key={attempt.attempt_id}
                    className="result-card"
                    onClick={() => setSelectedAttempt(attempt)}
                  >
                    <div className="card-header">
                      <h3 className="card-title">Attempt #{index + 1}</h3>
                    </div>
                    <div className="card-body">
                      <div className="card-text-item">
                        <p className="item-label">Your Score</p>
                        <p
                          className="item-value"
                          style={{
                            color:
                              attempt.obtained_score > attempt.total_marks / 2
                                ? "#28a745"
                                : "#dc3545",
                          }}
                        >
                          {attempt.obtained_score}/{attempt.total_marks}
                        </p>
                      </div>
                      <div className="card-text-item">
                        <p className="item-label">Correct Answers</p>
                        <p className="item-value text-green">
                          {
                            attempt.question_attempts.filter(
                              (qa) => qa.chosen_option === qa.correct_answer
                            ).length
                          }
                        </p>
                      </div>
                    </div>
                    <div className="card-footer">
                      <p>
                        Submitted on{" "}
                        {new Date(attempt.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-results-message">            </p>
              )}
            </div>
          </>
        )}
      </div>
      <AttemptModal attempt={selectedAttempt} onClose={closeModal} />
    </>
  );
}

export default ResultPage;
