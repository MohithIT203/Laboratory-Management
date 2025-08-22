import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./updateslot.css"; // Using your provided CSS

function AttendancePage() {
  const navigate = useNavigate();
  const { slotId } = useParams();

  // Load saved attendance data from localStorage if available
  const savedData = JSON.parse(localStorage.getItem(`attendance_${slotId}`));

  const initialStudents = savedData || Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: `Student ${i + 1}`,
    roll: `REG2025${i + 1}`,
    attendance: null,
    marks: "",
  }));

  const [attendanceData, setAttendanceData] = useState(initialStudents);

  // Save to localStorage whenever attendanceData changes
  useEffect(() => {
    localStorage.setItem(`attendance_${slotId}`, JSON.stringify(attendanceData));
  }, [attendanceData, slotId]);

  const toggleAttendance = (id, status) => {
    setAttendanceData((prev) =>
      prev.map((stu) =>
        stu.id === id
          ? { ...stu, attendance: status, marks: status === "absent" ? "" : stu.marks }
          : stu
      )
    );
  };

  const handleMarksChange = (id, value) => {
    setAttendanceData((prev) =>
      prev.map((stu) => (stu.id === id ? { ...stu, marks: value } : stu))
    );
  };

  const submitAttendance = () => {
    const invalid = attendanceData.some(
      (stu) => stu.attendance === "present" && !stu.marks
    );
    if (invalid) {
      alert("⚠️ Please enter marks for all students marked as Present.");
      return;
    }

    // Save final data to localStorage
    localStorage.setItem(`attendance_${slotId}`, JSON.stringify(attendanceData));
    alert("✅ Attendance Submitted!");
    // No navigation, stay on the same page
  };

  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => navigate("/update-slot")}>
        <FaArrowLeft />
      </button>

      <h2>Attendance</h2>

      <div className="table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Roll No.</th>
              <th>Attendance</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map(({ id, name, roll, attendance, marks }, idx) => (
              <tr key={id}>
                <td>{idx + 1}</td>
                <td>{name}</td>
                <td>{roll}</td>
                <td>
                  <div className="attendance-btns">
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
                  </div>
                </td>
                <td>
                  <input
                    type="number"
                    className="score-input"
                    min="0"
                    max="100"
                    value={marks}
                    disabled={attendance === "absent"}
                    onChange={(e) => handleMarksChange(id, e.target.value)}
                    placeholder="0-100"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="submit-container">
        <button className="submit-btn" onClick={submitAttendance}>
          Update Marks
        </button>
      </div>
    </div>
  );
}

export default AttendancePage;
