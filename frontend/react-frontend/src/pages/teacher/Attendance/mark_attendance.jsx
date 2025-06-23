import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./mark_attendance.css";

const MarkAttendance = () => {
  const location = useLocation();
  const { slotTitle } = location.state || {};

  const initialStudents = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Student ${i + 1}`,
    regNo: `REG2025${i + 1}`,
    attendance: null,
    score: "",
  }));

  const [students, setStudents] = useState(initialStudents);

  const toggleAttendance = (id, status) => {
    setStudents((prev) =>
      prev.map((stu) => (stu.id === id ? { ...stu, attendance: status } : stu))
    );
  };

  const handleScoreChange = (id, value) => {
    setStudents((prev) =>
      prev.map((stu) => (stu.id === id ? { ...stu, score: value } : stu))
    );
  };

  return (
    <div className="mark-attendance-container">
      <h2 className="mark-attendance-title">
        Mark Attendance & Scores for: {slotTitle || "Unknown Slot"}
      </h2>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Reg No</th>
            <th>Exp No 1</th>
            <th>Attendance</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {students.map(({ id, name, regNo, attendance, score }, index) => (
            <tr key={id}>
              <td>{index + 1}</td>
              <td>{name}</td>
              <td>{regNo}</td>
              <td>Experiment 1</td>
              <td>
                <button
                  className={`attendance-btn present ${
                    attendance === "present" ? "" : "inactive"
                  }`}
                  onClick={() => toggleAttendance(id, "present")}
                >
                  Present
                </button>
                <button
                  className={`attendance-btn absent ${
                    attendance === "absent" ? "" : "inactive"
                  }`}
                  onClick={() => toggleAttendance(id, "absent")}
                >
                  Absent
                </button>
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => handleScoreChange(id, e.target.value)}
                  className="score-input"
                  placeholder="0-100"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarkAttendance;
