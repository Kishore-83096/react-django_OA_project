import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/layout";
import { useNavigate } from "react-router-dom";

function ResultsPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get username from localStorage
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login");
      return;
    }

    // Fetch result from backend
    axios
      .get(`http://127.0.0.1:8000/api/results/?username=${username}`)
      .then((res) => {
        setResult(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(
          err.response?.data?.error ||
          err.response?.data?.detail ||
          "Failed to load result"
        );
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <Layout><p>Loading result...</p></Layout>;
  if (error) return <Layout><p style={{ color: "red" }}>{error}</p></Layout>;
  if (!result) return <Layout><p>No result found.</p></Layout>;

  const { total_score, answers = {}, submitted_at } = result;

  return (
    <Layout>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h2>Exam Result</h2>
        <p><strong>Submitted At:</strong> {new Date(submitted_at).toLocaleString()}</p>
        <p><strong>Total Score:</strong> {total_score}</p>

        <div style={{ marginTop: "20px", maxWidth: "600px", margin: "0 auto" }}>
          <h3>Answers</h3>
          {Object.keys(answers).length === 0 ? (
            <p>No answers submitted.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>Question ID</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>Selected Answer</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(answers).map(([qid, ans]) => (
                  <tr key={qid}>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{qid}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ans}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#6a5acd",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </Layout>
  );
}

export default ResultsPage;
