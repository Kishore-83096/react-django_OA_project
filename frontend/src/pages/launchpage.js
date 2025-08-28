// src/pages/WelcomePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function WelcomePage() {
  const [data, setData] = useState({ message: "", info: "" });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/welcome/") // your Django backend endpoint
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching welcome data:", error);
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 to-indigo-300">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">{data.message}</h1>
        <p className="text-gray-600 mb-6">{data.info}</p>

        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
