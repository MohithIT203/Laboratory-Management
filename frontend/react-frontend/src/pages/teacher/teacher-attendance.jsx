import StaffAppBar from "../../components/Staff_navbar";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./teacher-attendance.css";
import { FaArrowAltCircleLeft, FaArrowLeft, FaDatabase } from "react-icons/fa";

const StaffAttendance = () => {
  const location = useLocation();
  const slotId =
    location.state?.slotId || localStorage.getItem("slotid") || "null";

  const [students, setStudents] = useState([]);
  const [otp, setOtp] = useState(null);
  const [timer, setTimer] = useState(0);
  const [showBtn, setshowBtn] = useState(true);

  // Fetch students for this slot
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/faculty/students/${slotId}`
        );

        const studentsWithDefaults = response.data.students.map((stu) => ({
          ...stu,
          attendance: stu.attendance || "absent",
          score: stu.score ?? "",
        }));

        setStudents(studentsWithDefaults);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    if (slotId) fetchStudents();
  }, [slotId]);

  // Toggle attendance
  const toggleAttendance = (_id, status) => {
    setStudents((prev) =>
      prev.map((stu) =>
        stu._id === _id ? { ...stu, attendance: status } : stu
      )
    );
  };

  // Handle score change
  const handleScoreChange = (_id, value) => {
    setStudents((prev) =>
      prev.map((stu) => (stu._id === _id ? { ...stu, score: value } : stu))
    );
  };
  //post otp in db
  const postOtp = async (generatedOtp) => {
    try {
      await axios.post(`http://localhost:4000/faculty/otp`, {
        slotId,
        otp: generatedOtp,
      });
    } catch (error) {
      console.error("Failed to post Otp", error);
    }
  };
  const handleSaveAllScores = async () => {
  try {
    await axios.put(`http://localhost:4000/faculty/update-scores/${slotId}`, {
      students: students.map(s => ({
        _id: s._id,
        score: s.score
      }))
    });

    alert("✅ Scores updated successfully!");
  } catch (err) {
    console.error("Error updating scores", err);
    alert(" Failed to update scores!!!");
  }
};


  // Generate OTP and start timer
  const handleGenerateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    setOtp(newOtp);
    setshowBtn(false);
    postOtp(newOtp);
    setTimer(10); // 60 seconds countdown
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setOtp(null); // clear OTP when timer ends
          setshowBtn(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div>
      <StaffAppBar />

      <div className="mark-attendance-container">
        <p>
          <FaArrowLeft
            alt="back"
            onClick={() => window.history.back()}
            style={{
              cursor: "pointer",
              color: "green",
              position: "relative",
              // top:"80px",
              width: "25px",
              height: "20px",
            }}
          />
        </p>
        <h2 className="mark-attendance-title">
          Mark Attendance & Scores for: {slotId || "Unknown Slot"}
        </h2>

        {/* OTP Block */}
        <div className="otp-card">
          {showBtn && (
            <button className="otp-btn" onClick={handleGenerateOtp}>
              Generate OTP
            </button>
          )}
          {otp && (
            <div className="otp-display">
              <p className="otp-value">{otp}</p>
              <p className="otp-timer">Expires in: {timer}s</p>
            </div>
          )}
        </div>

        {/* Attendance Table */}
        <div className="table-wrapper">
          <table className="attendance-table">
            {students.length > 0 && (
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Reg No</th>

                  <th>Attendance</th>
                  <th>Score</th>
                </tr>
              </thead>
            )}
            <tbody>
              {students.length !== 0 ? (
                students.map(
                  ({ _id, Student_name, regno, attendance, score }, index) => (
                    <tr key={_id} className={attendance}>
                      <td data-label="S.No">{index + 1}</td>
                      <td data-label="Name">
                        {Student_name?.toUpperCase() || "N/A"}
                      </td>
                      <td data-label="Reg No">{regno || "N/A"}</td>

                      <td
                        data-label="Attendance"
                        className={`attendance-btn ${
                          attendance.toLowerCase() === "present" ? "present" : "absent"
                        }`}
                      >
                        {attendance?.toUpperCase() || "N/A"}
                      </td>

                      {/* <td data-label="Attendance">
                        <button
                          className={`attendance-btn present ${
                            attendance === "present" ? "" : "inactive"
                          }`}
                          onClick={() => toggleAttendance(_id, "present")}
                        >
                          Present
                        </button>
                        <button
                          className={`attendance-btn absent ${
                            attendance ==="absent" ? "" : "inactive"
                          }`}
                          onClick={() => toggleAttendance(_id, "absent")}
                        >
                          Absent
                        </button>
                      </td> */}
                      <td data-label="Score">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={score ?? ""}
                          onChange={(e) =>
                            handleScoreChange(_id, e.target.value)
                          }
                          className="score-input"
                          placeholder="0-100"
                        />
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#888",
                    }}
                  >
                    <FaDatabase
                      size={50}
                      style={{ marginBottom: "10px", color: "#aaa" }}
                    />
                    <p style={{ fontSize: "18px", fontWeight: "500" }}>
                      No Data Found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <button
  className="save-btn"
  onClick={handleSaveAllScores}
  style={{
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "green",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }}
>
  Save All Scores
</button>
        </div>
      </div>
      
    </div>
  );
};

export default StaffAttendance;
