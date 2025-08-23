import React, { useState } from "react";
import axios from "axios";
import { Eye, Trash2 } from "lucide-react";
import "./updatesubject.css";

export default function CourseTable({ courses, onDeleteCourse, onAddExperiment }) {
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  const [showExperimentPopup, setShowExperimentPopup] = useState(false);
  const [showAddExperimentPopup, setShowAddExperimentPopup] = useState(false);
  const [newExperiment, setNewExperiment] = useState({ exp_no: "", exp_name: "", description: "" });

  const selectedCourse = courses.find(c => c.course_code === selectedCourseCode);

  // View course experiments
  const handleViewCourse = (course) => {
    setSelectedCourseCode(course.course_code);
    setSelectedExperiment(null);
  };

  // Open edit experiment popup
  const handleViewExperiment = (exp) => {
    setSelectedExperiment({ ...exp });
    setShowExperimentPopup(true);
  };

  // Save updated experiment to backend
  const handleSaveExperiment = async () => {
    if (!selectedExperiment.exp_no || !selectedExperiment.exp_name || !selectedExperiment.description) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:4000/courses/${selectedCourse._id}/experiments/${selectedExperiment._id}`,
        {
          exp_no: Number(selectedExperiment.exp_no),
          exp_name: selectedExperiment.exp_name,
          description: selectedExperiment.description,
        }
      );

      alert("Experiment updated successfully!");
      setShowExperimentPopup(false);

      // Update course list locally with new data
      const updatedCourses = courses.map(course =>
        course._id === res.data._id ? res.data : course
      );

      window.location.reload(); // Simple refresh OR you can lift state up and update via props

    } catch (err) {
      console.error("Error updating experiment:", err);
      alert("Failed to update experiment");
    }
  };

  // Add new experiment to backend
  const handleAddNewExperiment = async () => {
    if (!newExperiment.exp_no || !newExperiment.exp_name || !newExperiment.description) {
      alert("Please fill all fields");
      return;
    }

    try {
      await onAddExperiment(selectedCourse._id, { 
        ...newExperiment, 
        exp_no: Number(newExperiment.exp_no) 
      });

      setNewExperiment({ exp_no: "", exp_name: "", description: "" });
      setShowAddExperimentPopup(false);
    } catch (err) {
      console.error("Error adding experiment:", err);
    }
  };

  return (
    <div className="table-wrapper">
      {/* COURSES TABLE */}
      <div className="teacher-table">
        <table>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Course Code</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.course_code}>
                <td>{course.course_name}</td>
                <td>{course.course_code}</td>
                <td>{course.department}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleViewCourse(course)}>
                    <Eye size={16} />
                  </button>
                  <button className="delete-btn" onClick={() => onDeleteCourse(course._id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EXPERIMENTS TABLE */}
      {selectedCourse && !showExperimentPopup && (
        <div className="teacher-table" style={{ marginTop: "20px" }}>
          <h3>{selectedCourse.course_name} - Experiments</h3>
          <button
            className="add-btn"
            style={{ width: "30px", height: "30px" }}
            onClick={() => setShowAddExperimentPopup(true)}
          >
            +
          </button>
          <table>
            <thead>
              <tr>
                <th>Experiment No</th>
                <th>Experiment Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedCourse.experiments.map((exp) => (
                <tr key={exp._id || exp.exp_no}>
                  <td>{exp.exp_no}</td>
                  <td>{exp.exp_name}</td>
                  <td>{exp.description}</td>
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

      {/* EDIT EXPERIMENT POPUP */}
      {showExperimentPopup && selectedExperiment && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Edit Experiment</h3>
            <label>
              Experiment No:
              <input
                type="number"
                value={selectedExperiment.exp_no}
                onChange={(e) => setSelectedExperiment({ ...selectedExperiment, exp_no: e.target.value })}
              />
            </label>
            <label>
              Experiment Name:
              <input
                type="text"
                value={selectedExperiment.exp_name}
                onChange={(e) => setSelectedExperiment({ ...selectedExperiment, exp_name: e.target.value })}
              />
            </label>
            <label>
              Description:
              <textarea
                value={selectedExperiment.description}
                onChange={(e) => setSelectedExperiment({ ...selectedExperiment, description: e.target.value })}
              />
            </label>
            <div style={{ marginTop: "10px" }}>
              <button className="edit-btn" onClick={handleSaveExperiment}>Save</button>
              <button className="delete-btn" onClick={() => setShowExperimentPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD EXPERIMENT POPUP */}
      {showAddExperimentPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Add Experiment</h3>
            <label>
              Experiment No:
              <input
                type="number"
                value={newExperiment.exp_no}
                onChange={(e) => setNewExperiment({ ...newExperiment, exp_no: e.target.value })}
              />
            </label>
            <label>
              Experiment Name:
              <input
                type="text"
                value={newExperiment.exp_name}
                onChange={(e) => setNewExperiment({ ...newExperiment, exp_name: e.target.value })}
              />
            </label>
            <label>
              Description:
              <textarea
                value={newExperiment.description}
                onChange={(e) => setNewExperiment({ ...newExperiment, description: e.target.value })}
              />
            </label>
            <div style={{ marginTop: "10px" }}>
              <button className="edit-btn" onClick={handleAddNewExperiment}>Add</button>
              <button className="delete-btn" onClick={() => setShowAddExperimentPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
