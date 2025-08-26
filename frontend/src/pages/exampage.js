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

  // Fetch exam questions
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/exam/?username=${username}`)
      .then((res) => {
        if (res.data.questions && res.data.questions.length > 0) {
          setQuestions(res.data.questions);

          // Load timer from localStorage if exists, else backend timer
          const savedTimer = parseInt(localStorage.getItem("exam_timer"), 10);
          const backendTimer = res.data.exam_settings["timer in minutes"] * 60;
          setTimer(!isNaN(savedTimer) ? savedTimer : backendTimer);

          // Load saved answers
          const savedAnswers = JSON.parse(localStorage.getItem("exam_answers") || "{}");
          setAnswers(savedAnswers);

          // Load current question index
          const savedIndex = parseInt(localStorage.getItem("exam_current_index"), 10);
          setCurrentIndex(!isNaN(savedIndex) ? savedIndex : 0);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  // Timer countdown
  useEffect(() => {
    if (timer <= 0 || questions.length === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        const newTime = prev - 1;
        localStorage.setItem("exam_timer", newTime);

        if (newTime <= 0) {
          handleSubmit();
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, questions]);

  const handleAnswer = (option) => {
    const updatedAnswers = { ...answers, [questions[currentIndex].id]: option };
    setAnswers(updatedAnswers);
    localStorage.setItem("exam_answers", JSON.stringify(updatedAnswers));
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
  const username = localStorage.getItem("username");
  if (!username) return;

  // Get saved answers from localStorage (or state)
  const answers = JSON.parse(localStorage.getItem("exam_answers") || "{}");

  // Send POST request with username and answers
  axios
    .post("http://127.0.0.1:8000/api/submit_exam/", { 
      username, 
      answers 
    })
    .then((res) => {
      alert(res.data.message || "Exam submitted!");
      console.log("Submitted answers:", res.data.answers);

      // Clear localStorage
      localStorage.removeItem("exam_answers");
      localStorage.removeItem("exam_timer");
      localStorage.removeItem("exam_current_index");

      navigate("/dashboard");
    })
    .catch((err) => {
      console.error(err);
      alert(err.response?.data?.error || "Failed to submit exam");
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
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h2>Exam</h2>
        <div style={{ marginBottom: "10px" }}>
          <strong>Time Remaining: {formatTime(timer)}</strong>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "6px", maxWidth: "600px", margin: "0 auto" }}>
          <p>
            <strong>Question {currentIndex + 1}:</strong> {question.question}
          </p>

          {question.options && (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {question.options.map((opt, idx) => (
                <li key={idx} style={{ margin: "5px 0" }}>
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
          )}
        </div>

        <div style={{ marginTop: "15px" }}>
          <button onClick={handlePrev} disabled={currentIndex === 0} style={{ marginRight: "10px" }}>
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
