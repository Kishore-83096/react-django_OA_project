// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");

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
        console.error(err);
        navigate("/login");
      });
  }, [navigate]);

  const handleStartExam = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/login");
      return;
    }

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
        alert("No questions available.");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        alert("Failed to start exam.");
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
      <Header />
      <div className="min-h-screen bg-gradient-to-r from-indigo-200 to-purple-300 p-6">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">
            Dashboard
          </h1>

          <div className="space-y-3">
            <p>
              <strong>Exam Available:</strong> {exam_available ? "Yes" : "No"}
            </p>
            <p>
              <strong>Total Questions:</strong> {total_questions}
            </p>
            <p>
              <strong>Total Marks:</strong> {total_marks}
            </p>
            <p>
              <strong>Exam Timer:</strong> {timer} minutes
            </p>
          </div>

          {exam_available && (
            <button
              onClick={handleStartExam} // <-- Add this!
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            >
              Start Exam
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
