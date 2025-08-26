import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import LaunchPage from "./pages/launchpage";
import ExamPage from "./pages/exampage";
import ResultsPage from "./pages/result";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("username"));

  return (
    <Router>
      <Routes>
        {/* Root shows launch page */}
        <Route path="/" element={<LaunchPage />} />

        {/* Login route */}
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage onLogin={() => setIsLoggedIn(true)} />
          }
        />

        {/* Register route */}
        <Route
          path="/register"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <RegisterPage />
          }
        />

        {/* Dashboard route protected */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Exam route protected */}
        <Route
          path="/exam"
          element={isLoggedIn ? <ExamPage /> : <Navigate to="/login" />}
        />
        {/* Results route protected */}
        <Route
          path="/results"
          element={isLoggedIn ? <ResultsPage /> : <Navigate to="/login" />}
        />
      </Routes> 
    </Router>
  );
}

export default App;
