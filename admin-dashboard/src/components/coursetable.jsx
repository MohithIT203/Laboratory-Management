import React, { useState } from "react";
import { Eye, Trash2, Plus } from "lucide-react";
import "./updatesubject.css";

export default function CourseTable({ courses, onDeleteCourse, onAddExperiment, onUpdateExperiment }) {
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [originalExpNo, setOriginalExpNo] = useState(null);

  const [showExperimentPopup, setShowExperimentPopup] = useState(false);
  const [showAddExperimentPopup, setShowAddExperimentPopup] = useState(false);
  const [newExperiment, setNewExperiment] = useState({ exp_no: "", exp_name: "", description: "" });

  const selectedCourse = courses.find(c => c.course_code === selectedCourseCode);

  // View course experiments
  const handleViewCourse = (course) => {
    setSelectedCourseCode(course.course_code);
    setSelectedExperiment(null);
  };

  // Edit experiment
  const handleViewExperiment = (exp) => {
    setOriginalExpNo(exp.exp_no);
    setSelectedExperiment({ ...exp });
    setShowExperimentPopup(true);
  };

  const handleSaveExperiment = () => {
    if (!selectedExperiment.exp_no || !selectedExperiment.exp_name || !selectedExperiment.description) {
      alert("Please fill all fields");
      return;
    }

    onUpdateExperiment(selectedCourse.course_code, {
      oldExpNo: originalExpNo,
      ...selectedExperiment,
      exp_no: Number(selectedExperiment.exp_no),
    });

    setShowExperimentPopup(false);
  };

  // Add new experiment to selected course (after viewing course)
  const handleAddNewExperiment = () => {
    if (!newExperiment.exp_no || !newExperiment.exp_name || !newExperiment.description) {
      alert("Please fill all fields");
      return;
    }

    onAddExperiment(selectedCourse.course_code, { ...newExperiment, exp_no: Number(newExperiment.exp_no) });
    setNewExperiment({ exp_no: "", exp_name: "", description: "" });
    setShowAddExperimentPopup(false);
  };

  return (
    <div className="table-wrapper">
      {/* Courses Table */}
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
                  <button className="delete-btn" onClick={() => onDeleteCourse(course.course_code)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Experiments Table */}
      {selectedCourse && !showExperimentPopup && (
        <div className="teacher-table" style={{ marginTop: "20px" }}>
          <h3>{selectedCourse.course_name} - Experiments</h3>
          {/* Add Experiment Button */}
          <button className="add-btn" style={{ marginTop: "0px" ,width:"30px",height:"30px"}} onClick={() => setShowAddExperimentPopup(true)}>
            +
          </button>
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

      {/* Edit Experiment Popup */}
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

      {/* Add Experiment Popup */}
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
