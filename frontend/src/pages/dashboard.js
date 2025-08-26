import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Layout from "../components/layout";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("username") || "Guest";
    axios
      .get(`http://127.0.0.1:8000/api/dashboard/?username=${username}`)
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        setData({
          username: "Guest",
          exam_available: false,
          total_questions: 0,
          total_marks: 0,
          timer: 0,
        });
      });
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  return (
    <Layout>
      <h2>Welcome, {data.username}!</h2>
      <p>This is your dashboard content.</p>

      <div style={{ marginTop: "20px" }}>
        {data.exam_available ? (
          <div>
            <p>Total Questions: {data.total_questions}</p>
            <p>Total Marks: {data.total_marks}</p>
            <p>Exam Duration: {Math.floor(data.timer)} minutes</p>
            <Link
              to="/exam"
              style={{
                padding: "10px 20px",
                background: "#6a5acd",
                color: "white",
                borderRadius: "4px",
                textDecoration: "none",
              }}
            >
              Start Exam
            </Link>
          </div>
        ) : (
          <button
            disabled
            style={{
              padding: "10px 20px",
              background: "grey",
              color: "white",
              borderRadius: "4px",
              border: "none",
            }}
          >
            Exam Not Available
          </button>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
