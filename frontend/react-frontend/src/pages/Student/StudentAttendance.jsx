import React, { useState } from "react";
import "./StudentAttendance.css";
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";
import { IoCalendarOutline } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import MiniAppBar from "../../components/Student_navbar";
import axios from "axios";

const StudentAttendance = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const verifyOtp = async (e) => {
    e.preventDefault();

    try {
      
      const studentId = localStorage.getItem("student_id");

      const res = await axios.post("http://localhost:4000/verify-otp", {
        Student_id: studentId,
        otp: Number(otp)
      });

      
        setMessage(res.data.message);
      
    } catch (err) {
      console.error("Error verifying OTP", err);
      setMessage("❌ Error verifying OTP.");
    }
  };

  return (
    <>
      <MiniAppBar />
      <div className="attendance-container">
        <div className="stats-cards">
          <div className="acard green-card">
            <p>Attendance Rate</p>
            <h2>100%</h2>
            <FiTrendingUp className="icon" />
          </div>
          <div className="acard">
            <p>Total Sessions</p>
            <h2>1</h2>
            <IoCalendarOutline className="icon blue" />
          </div>
          <div className="acard">
            <p>Present</p>
            <h2>1</h2>
            <FaCheckCircle className="icon green" />
          </div>
          <div className="acard">
            <p>Absent</p>
            <h2 className="red">0</h2>
            <FaTimesCircle className="icon red" />
          </div>
           <div className="otp-block">
          <form onSubmit={verifyOtp}>
            {message && <p style={{ marginTop: "10px" }}>{message}</p>}
            <input
              type="text"
              maxLength={6}
              placeholder="Enter OTP"
              value={otp}
              required
              onChange={(e) => setOtp(e.target.value)}
              style={{
                height: "25px",
                margin: "10px",
                maxWidth: "300px",
              }}
            />
            <button className="verify-btn" type="submit">
              Verify OTP
            </button>
          </form>
        </div>
        </div>

       

        <h3 className="history-title">Attendance History</h3>
        <div className="session-card">
          <div className="session-header">
            <div>
              <h4>Data Structures 2</h4>
              <p className="session-subtitle">
                Binary Trees and Graph Algorithms Implementation
              </p>
            </div>
            <span className="present-badge">
              <FaCheckCircle className="badge-icon" /> Present
            </span>
          </div>
          <div className="session-info">
            <div className="info-item">
              <FaCalendarAlt className="info-icon" />
              <span>Monday, January 20, 2025</span>
            </div>
            <div className="info-item">
              🕒 <span>8:45 AM - 10:30 AM</span>
            </div>
            <div className="info-item">
              <HiOutlineLocationMarker className="info-icon" />
              <span>CSE Lab 1</span>
            </div>
          </div>
          <p className="marked-time">Marked on Jan 20, 2025, 4:05 PM</p>
        </div>
      </div>
    </>
  );
};

export default StudentAttendance;
