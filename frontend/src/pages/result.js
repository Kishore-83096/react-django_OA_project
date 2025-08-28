// src/pages/ResultPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/layout"; // Layout already includes Header
import { useNavigate } from "react-router-dom";

function ResultPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
        setResult(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 401) {
          // Token invalid or expired
          localStorage.clear();
          navigate("/login");
        } else {
          setError(err.response?.data?.error || "Failed to fetch results");
          setLoading(false);
        }
      });
  }, [accessToken, navigate]);

  if (loading) return <Layout><p>Loading results...</p></Layout>;
  if (error) return <Layout><p className="text-red-500">{error}</p></Layout>;
  if (!result) return <Layout><p>No results found.</p></Layout>;

  const { username, total_score, answers, submitted_at } = result;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-6 bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Exam Result</h2>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Total Score:</strong> {total_score}</p>
        <p><strong>Submitted At:</strong> {new Date(submitted_at).toLocaleString()}</p>

        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Answers:</h3>
          <ul className="list-disc list-inside">
            {answers && Object.keys(answers).map((qid) => (
              <li key={qid}>
                <strong>Q{qid}:</strong> {answers[qid]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}

export default ResultPage;
