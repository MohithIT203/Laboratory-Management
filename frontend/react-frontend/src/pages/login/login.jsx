import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const userEmail = result.user.email;
        console.log("Signed in with:", userEmail);

        if (userEmail.endsWith("@bitsathy.ac.in")) {
          alert("Student");
          navigate("/student");
        } else {
          navigate("/teacher");
        }
      })
      .catch((error) => {
        console.error("Google sign-in error:", error);
      });
  };

  const handleLogin = async () => {
    // Hardcoded credentials
    if (email === "harrish@gmail.com" && password === "harrish") {
      const definedEmail = "harrish2005@gmail.com";
      const definedPassword = "harrish";

      // You can store it in localStorage/sessionStorage or just log it
      console.log("Defined Email:", definedEmail);
      console.log("Defined Password:", definedPassword);

      navigate("/student");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/login",
        { userEmail: email },
        { withCredentials: true }
      );

      if (response.data.role === "Student") {
        navigate("/student/dashboard");
      } else if (response.data.role === "faculty") {
        navigate("/faculty/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Login error");
    }
  };

  return (
    <div className="mainContainer">
      <div className="outerdiv">
        <h2 className="head">BIT LAB SLOT BOOKING</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ color: "#4b5563", display: "flex", gap: "8px" }}>
              <EmailIcon style={{ color: "#0d9f62" }} /> Email:
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="inputField"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ color: "#4b5563", display: "flex", gap: "8px" }}>
              <KeyIcon style={{ color: "#0d9f62" }} /> Password:
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="inputField"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div>
            <button type="button" className="submitBtn" onClick={handleLogin}>
              Login
            </button>
          </div>
          <p style={{ fontSize: "12px", fontWeight: "500" }}>Or</p>
        </form>

        <button className="google" onClick={handleGoogleSignIn}>
          <img src="/src/assets/google.png" alt="Google" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
