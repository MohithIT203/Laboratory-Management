import React, { useState, useEffect } from "react";
import "./StudentAttendance.css";
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle,FaUserCircle, FaAward  } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";
import { IoCalendarOutline } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import toast from "react-hot-toast";
import MiniAppBar from "../../components/Student_navbar";
import axios from "axios";

const StudentAttendance = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [state, setState] = useState("");
  const [score, setscore] = useState("");
  const studentId = localStorage.getItem("student_id");

  
  useEffect(() => {
    
    fetchHistory();
  }, [studentId]);

  const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_APP_URL}/student/attendance-history/${studentId}`
        );
        setAttendance(res.data.slots || []);
        setState(res.data.attendance);
        setscore(res.data.score);
      } catch (err) {
        console.error("Error fetching history", err);
      }
    };
  
  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_APP_URL}/verify-otp`, {
        Student_id: studentId,
        otp: Number(otp),
      });
      fetchHistory();
      // setMessage(res.data.message);
      toast.success("OTP verified and Attendance Marked")
    } catch (err) {
      console.error("Error verifying OTP", err);
      // setMessage("❌ Error verifying OTP.");
      toast.error("Error verifying OTP");
    }
  };


  const totalSessions = attendance.length;
  const presentCount = attendance.filter((s) => s.attendance === "present").length;
  const absentCount = totalSessions - presentCount;
  const attendanceRate =
    totalSessions > 0 ? ((presentCount / totalSessions) * 100).toFixed(1) : 0;

  return (
    <>
      <MiniAppBar />
      <div className="attendance-container">
        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="acard green-card">
            <p>Attendance Rate</p>
            <h2>{attendanceRate}%</h2>
            <FiTrendingUp className="icon" />
          </div>
          <div className="acard">
            <p>Total Sessions</p>
            <h2>{totalSessions}</h2>
            <IoCalendarOutline className="icon blue" />
          </div>
          <div className="acard">
            <p>Present</p>
            <h2>{presentCount}</h2>
            <FaCheckCircle className="icon green" />
          </div>
          <div className="acard">
            <p>Absent</p>
            <h2 className="red">{absentCount}</h2>
            <FaTimesCircle className="icon red" />
          </div>
        </div>

        {/* OTP Block */}
        <div className="otp-block">
          <form onSubmit={verifyOtp}>
            {message && <p style={{ marginLeft: "12px"}}>{message}</p>}
            <input
              type="text"
              maxLength={6}
              placeholder="Enter OTP"
              value={otp}
              required
              onChange={(e) => setOtp(e.target.value)}
              style={{ height: "25px",padding:"20px", margin: "10px",width:"90%",boxSizing:"border-box"}}
            />
            <button className="verify-btn" type="submit">
              Verify OTP
            </button>
          </form>
        </div>

        {/* Attendance History */}
        <h3 className="history-title">Attendance History</h3>
        {attendance.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          attendance.map((slot) => (
            <div key={slot._id} className="session-card">
              <div className="session-header">
                <div>
                  <h4>{slot.Course}</h4>
                  <p className="session-subtitle">{slot.experiment.exp_name} : {slot.experiment.exp_description}</p>
                </div>
                <span
                  className={
                    slot.attendance === "present"
                      ? "present-badge"
                      : "absent-badge"
                  }
                >
                  {slot.attendance === "present" ? (
                    <>
                      <FaCheckCircle className="badge-icon" />Present
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="badge-icon" /> Absent
                    </>
                  )}
                </span>
              </div>
              <div className="session-info">
                <div className="info-item">
                  <FaCalendarAlt className="info-icon" />
                  <span>{new Date(slot.Date).toDateString()}</span>
                </div>
                <div className="info-item">
                  🕒{" "}
                  <span>
                    {slot.Time}
                  </span>
                </div>
                <div className="info-item">
                  <HiOutlineLocationMarker className="info-icon" />
                  <span>{slot.venue}</span>
                </div>
                <div className="info-item">
                  <FaUserCircle />
                  <span>
                    Mr/Ms {slot.Staff_name}
                  </span>
                </div>
                <div className="info-item">
                  <FaAward />
                  <span>
                    Marks Scored : {slot.marks} / 100
                  </span>
                </div>
              </div>
              <p className="marked-time">
                Marked on n/a
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default StudentAttendance;
