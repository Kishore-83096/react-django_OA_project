import React, { useEffect, useState } from "react";
import axios from "axios";

function LaunchPage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/welcome/") // use your backend welcome endpoint
      .then((res) => setMessage(res.data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Exam Portal</h1>
      <p>{message || "Loading..."}</p>
      <button onClick={() => (window.location.href = "/login")}>Login</button>
      <button onClick={() => (window.location.href = "/register")}>Register</button>
    </div>
  );
}

export default LaunchPage;
