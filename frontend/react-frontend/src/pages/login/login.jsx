import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import "./login.css";
import LoginPopup from "./loginPopup";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const emailFromGoogle = result.user.email;
        console.log("Signed in with:", emailFromGoogle);
        handlelogin(emailFromGoogle);
      })
      .catch((error) => {
        console.error("Google sign-in error:", error);
      });
  };
  

  const handlelogin = async (email) => {
    try {
      const response = await axios.post("http://localhost:4000/api/user/login", {
        userEmail: email,
      },{ withCredentials: true });
       setAlert({ show: true, type: "success", message: "Login Successful!" });
      if (response.data.role === "Student") {
         localStorage.setItem("student_id", response.data.user_id);
        navigate("/student/dashboard",{ state: { Studentdept: response.data.dept,Student_id:response.data.user_id}});
      } else if (response.data.role === "faculty") {
         localStorage.setItem("Facultyname", response.data.name);
      localStorage.setItem("FacultyEmail", response.data.email);
      localStorage.setItem("Facultydept", response.data.dept);
        navigate("/faculty/dashboard",{ state: { Facultyname:response.data.name,Facultydept: response.data.dept,FacultyEmail:response.data.email }});
      }
    } catch (err) {
      console.error(err);
      setAlert({ show: true, type: "error", message: "Login Failed. Try again." });
    }
  };

  return (
    <div className="mainContainer">
      
         {alert.show && <LoginPopup type={alert.type} message={alert.message} />}
      <div className="outerdiv">
        <h2 className="head">BIT LAB SLOT BOOKING</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ color: "#4b5563", display: "flex", gap: "8px" }}>
              <EmailIcon style={{ color: "#6018be" }} /> Email:
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
              <KeyIcon style={{ color: "#6018be" }} /> Password:
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
            <button type="submit" className="submitBtn" >
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
