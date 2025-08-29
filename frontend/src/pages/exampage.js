import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

function ExamPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(0); // total exam time in seconds
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const accessToken = localStorage.getItem("access_token");

  // Fetch exam questions
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }
    setMessage("Loading exam questions...");
    axios
      .get("http://127.0.0.1:8000/api/exam/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        if (res.data.questions && res.data.questions.length > 0) {
          setQuestions(res.data.questions);

          // Timer
          const savedTimer = parseInt(localStorage.getItem("exam_timer"), 10);
          const backendTimer = res.data.exam_settings["timer in minutes"] * 60;
          setTimer(!isNaN(savedTimer) ? savedTimer : backendTimer);

          // Saved answers
          const savedAnswers = JSON.parse(localStorage.getItem("exam_answers") || "{}");
          setAnswers(savedAnswers);

          // Current question index
          const savedIndex = parseInt(localStorage.getItem("exam_current_index"), 10);
          setCurrentIndex(!isNaN(savedIndex) ? savedIndex : 0);
        } else {
          setMessage("No questions available for this exam.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch exam questions:", err);
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          setMessage("Failed to load exam. Please try again.");
        }
        setLoading(false);
      });
  }, [accessToken, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timer <= 0 || questions.length === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        const newTime = prev - 1;
        localStorage.setItem("exam_timer", newTime);
        if (newTime <= 0) handleSubmit();
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, questions]);

  // Save answer to state, localStorage, and backend
  const handleAnswer = (option) => {
    const questionId = questions[currentIndex].id;
    const updatedAnswers = { ...answers, [questionId]: option };
    setAnswers(updatedAnswers);
    localStorage.setItem("exam_answers", JSON.stringify(updatedAnswers));

    // Save to backend
    axios
      .post(
        "http://127.0.0.1:8000/api/save_answer/",
        { question_id: questionId, selected_option: option },
        { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
      )
      .then((res) => console.log("Answer saved:", res.data))
      .catch((err) => console.error("Failed to save answer:", err.response?.data || err.message));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      localStorage.setItem("exam_current_index", nextIndex);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      localStorage.setItem("exam_current_index", prevIndex);
    }
  };

  const handleSubmit = () => {
    if (!accessToken) return;

    setMessage("Submitting exam...");
    const savedAnswers = JSON.parse(localStorage.getItem("exam_answers") || "{}");

    axios
      .post(
        "http://127.0.0.1:8000/api/submit_exam/",
        { answers: savedAnswers },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((res) => {
        setMessage(res.data.message || "Exam submitted successfully!");
        localStorage.removeItem("exam_answers");
        localStorage.removeItem("exam_timer");
        localStorage.removeItem("exam_current_index");
        setTimeout(() => navigate("/dashboard"), 2000);
      })
      .catch((err) => {
        console.error("Failed to submit exam:", err);
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          setMessage(err.response?.data?.error || "Failed to submit exam.");
        }
      });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) return <p className="text-center mt-5">{message}</p>;
  if (!questions.length) return <p className="text-center mt-5">{message || "No questions available."}</p>;

  const question = questions[currentIndex];
  const selectedOption = answers[question.id] || "";

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

          .exam-container {
            font-family: 'Poppins', sans-serif;
            min-height: calc(100vh - 74px);
            background-color: var(--light-gray);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
          }

          .exam-card {
            background-color: var(--white);
            padding: 2.5rem;
            border-radius: var(--border-radius);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            max-width: 800px;
            width: 100%;
            text-align: left;
          }

          .exam-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
          }

          .exam-title {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary-color);
          }
          
          .timer {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--text-color);
            background-color: var(--light-gray);
            padding: 0.5rem 1rem;
            border-radius: var(--border-radius);
          }

          .question-section {
            background-color: var(--light-gray);
            border-radius: var(--border-radius);
            padding: 2rem;
            margin-bottom: 2rem;
          }

          .question-text {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 1.5rem;
          }
          
          .options-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .option-item {
            margin-bottom: 1rem;
          }

          .option-label {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 1rem;
            background-color: var(--white);
            border: 1px solid #e5e7eb;
            border-radius: var(--border-radius);
            transition: all 0.2s ease;
          }

          .option-label:hover {
            background-color: #f9fafb;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          }

          .option-input {
            margin-right: 1rem;
          }

          .option-label input:checked + span {
            font-weight: 600;
            color: var(--primary-color);
          }

          .navigation-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 2rem;
            gap: 1rem;
          }

          .nav-btn {
            background-color: var(--primary-color);
            color: var(--white);
            padding: 1rem 2rem;
            border-radius: var(--border-radius);
            font-weight: 600;
            font-size: 1rem;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s ease;
            min-width: 150px;
          }

          .nav-btn:hover {
            background-color: #4338ca;
          }

          .nav-btn:disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
          }
          
          .message {
            color: var(--primary-color);
            text-align: center;
            margin-top: 1rem;
            font-size: 0.9rem;
            font-style: italic;
          }
        `}
      </style>
      <Header />
      <div className="exam-container">
        <div className="exam-card">
          <div className="exam-header">
            <h1 className="exam-title">Online Exam</h1>
            <div className="timer">
              Time Remaining: {formatTime(timer)}
            </div>
          </div>

          <div className="question-section">
            <p className="question-text">
              <span className="font-bold">Question {currentIndex + 1}:</span> {question.question}
            </p>
            <ul className="options-list">
              {question.options.map((opt, idx) => (
                <li key={idx} className="option-item">
                  <label className="option-label">
                    <input
                      type="radio"
                      name={`q_${currentIndex}`}
                      value={opt}
                      checked={selectedOption === opt}
                      onChange={() => handleAnswer(opt)}
                      className="option-input"
                    />
                    <span>{opt}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="navigation-buttons">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="nav-btn"
            >
              Previous
            </button>
            {currentIndex === questions.length - 1 ? (
              <button onClick={handleSubmit} className="nav-btn">
                Submit Exam
              </button>
            ) : (
              <button onClick={handleNext} className="nav-btn">
                Next
              </button>
            )}
          </div>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </>
  );
}

export default ExamPage;
