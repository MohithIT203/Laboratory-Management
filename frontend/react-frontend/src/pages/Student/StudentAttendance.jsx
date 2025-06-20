import React from "react";
import "./StudentAttendance.css";
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";
import { IoCalendarOutline } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";

const StudentAttendance = () => {
  return (
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
  );
};

export default StudentAttendance;
