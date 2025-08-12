import StaffAppBar from "../../components/Staff_navbar";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./teacher-attendance.css";

const StaffAttendance = () => {
  const location = useLocation();
  const slotId =
    location.state?.slotId || localStorage.getItem("slotid") || "null";

  const [students, setStudents] = useState([]);

  // Fetch students for this slot
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/faculty/students/${slotId}`
        );

        // Ensure attendance & score fields exist
        const studentsWithDefaults = response.data.students.map((stu) => ({
          ...stu,
          attendance: stu.attendance || "absent",
          score: stu.score ?? ""
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
      prev.map((stu) =>
        stu._id === _id ? { ...stu, score: value } : stu
      )
    );
  };

  return (
    <div>
      <StaffAppBar />

      <div className="mark-attendance-container">
        <h2 className="mark-attendance-title">
          Mark Attendance & Scores for: {slotId || "Unknown Slot"}
        </h2>

        <table className="attendance-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Reg No</th>
              <th>Exp No</th>
              <th>Attendance</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
  {students.map(({ _id, Student_name, regno, attendance, score }, index) => (
    <tr key={_id} className={attendance}>
      <td data-label="S.No">{index + 1}</td>
      <td data-label="Name">{Student_name?.toUpperCase() || "N/A"}</td>
      <td data-label="Reg No">{regno || "N/A"}</td>
      <td data-label="Exp No">Experiment 1</td>
      <td data-label="Attendance">
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
            attendance === "absent" ? "" : "inactive"
          }`}
          onClick={() => toggleAttendance(_id, "absent")}
        >
          Absent
        </button>
      </td>
      <td data-label="Score">
        <input
          type="number"
          min="0"
          max="100"
          value={score ?? ""}
          onChange={(e) => handleScoreChange(_id, e.target.value)}
          className="score-input"
          placeholder="0-100"
        />
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default StaffAttendance;
