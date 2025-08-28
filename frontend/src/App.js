import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import LaunchPage from "./pages/launchpage";
import ExamPage from "./pages/exampage";
import ResultsPage from "./pages/result";

function App() {
  // ✅ Use the correct key for token storage
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("access_token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Root shows launch page */}
        <Route path="/" element={<LaunchPage />} />

        {/* Register route */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Login route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard route (protected) */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Exam route (protected) */}
        <Route
          path="/exam"
          element={isLoggedIn ? <ExamPage /> : <Navigate to="/login" />}
        />

        {/* Results route (protected by username presence) */}
        <Route
          path="/results"
          element={
            localStorage.getItem("username") ? <ResultsPage /> : <Navigate to="/login" />
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
