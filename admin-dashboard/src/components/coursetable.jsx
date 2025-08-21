import React, { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import "./updatesubject.css"; // reuse same css

export default function CourseTable() {
  // ✅ Dummy data
  const [courses, setCourses] = useState([
    {
      course_name: "IoT",
      course_code: "IOT101",
      experiments: [
        { exp_no: 1, exp_name: "Introduction to Sensors", description: "Basics of sensor interfacing" },
        { exp_no: 2, exp_name: "Smart Home Automation", description: "Build a home automation system using Arduino + IoT" },
        { exp_no: 3, exp_name: "IoT Cloud Data", description: "Send sensor data to the cloud" }
      ]
    },
    {
      course_name: "POC",
      course_code: "POC202",
      experiments: [
        { exp_no: 1, exp_name: "Cloud Integration", description: "Hands-on with AWS services" },
        { exp_no: 2, exp_name: "ML Deployment", description: "Deploy ML model on cloud platform" },
        { exp_no: 3, exp_name: "Realtime Dashboard", description: "Stream data into dashboard" }
      ]
    }
  ]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [page, setPage] = useState(1);

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setSelectedExperiment(null);
  };

  const handleViewExperiment = (exp) => {
    setSelectedExperiment(exp);
    setPage(1);
    setShowPopup(true);
  };

  const handleDeleteCourse = (courseCode) => {
    setCourses(courses.filter((c) => c.course_code !== courseCode));
  };

  const handleSave = () => {
    const updatedCourses = courses.map((c) =>
      c.course_code === selectedCourse.course_code
        ? {
            ...c,
            experiments: c.experiments.map((e) =>
              e.exp_no === selectedExperiment.exp_no ? selectedExperiment : e
            )
          }
        : c
    );
    setCourses(updatedCourses);
    setShowPopup(false);
  };

  return (
    <div className="table-wrapper">
      <div className="teacher-table">
        <table>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Course Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index}>
                <td>{course.course_name}</td>
                <td>{course.course_code}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleViewCourse(course)}>
                    <Eye size={16} />
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteCourse(course.course_code)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Show experiments list for selected course */}
      {selectedCourse && !showPopup && (
        <div className="teacher-table" style={{ marginTop: "20px" }}>
          <h3>{selectedCourse.course_name} - Experiments</h3>
          <table>
            <thead>
              <tr>
                <th>Experiment No</th>
                <th>Experiment Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedCourse.experiments.map((exp) => (
                <tr key={exp.exp_no}>
                  <td>{exp.exp_no}</td>
                  <td>{exp.exp_name}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleViewExperiment(exp)}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Popup for experiment details (merged into one page) */}
{showPopup && selectedExperiment && (
  <div className="popup-overlay">
    <div className="popup-box">
      <h3>Experiment Details</h3>

      <p><strong>Experiment No:</strong> {selectedExperiment.exp_no}</p>

      <label>
        Experiment Name:
        <input
          type="text"
          value={selectedExperiment.exp_name}
          onChange={(e) =>
            setSelectedExperiment({ ...selectedExperiment, exp_name: e.target.value })
          }
        />
      </label>

      <label>
        Description:
        <textarea
          value={selectedExperiment.description}
          onChange={(e) =>
            setSelectedExperiment({ ...selectedExperiment, description: e.target.value })
          }
        />
      </label>

      <div style={{ marginTop: "10px" }}>
        <button className="edit-btn" onClick={handleSave}>Save</button>
        <button className="delete-btn" onClick={() => setShowPopup(false)}>Close</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
