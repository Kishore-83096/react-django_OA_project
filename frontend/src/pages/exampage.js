// src/pages/ExamPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/layout";
import { useNavigate } from "react-router-dom";

function ExamPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(0); // total exam time in seconds
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("access_token");

  // Fetch exam questions
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

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
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 401) {
          // Token invalid or expired
          localStorage.clear();
          navigate("/login");
        } else {
          setLoading(false);
        }
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

    const savedAnswers = JSON.parse(localStorage.getItem("exam_answers") || "{}");

    axios
      .post(
        "http://127.0.0.1:8000/api/submit_exam/",
        { answers: savedAnswers },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((res) => {
        alert(res.data.message || "Exam submitted!");
        localStorage.removeItem("exam_answers");
        localStorage.removeItem("exam_timer");
        localStorage.removeItem("exam_current_index");
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          alert(err.response?.data?.error || "Failed to submit exam");
        }
      });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) return <Layout><p>Loading questions...</p></Layout>;
  if (!questions.length) return <Layout><p>No questions available.</p></Layout>;

  const question = questions[currentIndex];
  const selectedOption = answers[question.id] || "";

  return (
    <Layout>
      <div className="text-center mt-5">
        <h2>Exam</h2>
        <div className="mb-3">
          <strong>Time Remaining: {formatTime(timer)}</strong>
        </div>

        <div className="border p-5 rounded max-w-2xl mx-auto">
          <p><strong>Question {currentIndex + 1}:</strong> {question.question}</p>
          <ul className="list-none p-0">
            {question.options.map((opt, idx) => (
              <li key={idx} className="my-2">
                <label>
                  <input
                    type="radio"
                    name={`q_${currentIndex}`}
                    value={opt}
                    checked={selectedOption === opt}
                    onChange={() => handleAnswer(opt)}
                  />{" "}
                  {opt}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <button onClick={handlePrev} disabled={currentIndex === 0} className="mr-3">
            Previous
          </button>
          {currentIndex === questions.length - 1 ? (
            <button onClick={handleSubmit}>Submit Exam</button>
          ) : (
            <button onClick={handleNext}>Next</button>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ExamPage;
