// src/components/CourseTable.jsx
import React, { useState } from "react";
import axios from "axios";
import { Eye, Trash2 } from "lucide-react";
import AddPopup from "../AddPopup/AddPopup"; 
import "../TeacherTable/TeacherTable.css";

export default function CourseTable({ courses, onDeleteCourse, onUpdateCourse,pagination}) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  // Popup state
  const [isExperimentPopupOpen, setIsExperimentPopupOpen] = useState(false);
  const [formValues, setFormValues] = useState({ exp_no: "", exp_name: "", exp_description: "" });
  const [popupMode, setPopupMode] = useState("add"); // "add" or "edit"

  // ----- COURSE HANDLERS -----
  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setSelectedExperiment(null);
  };

  // ----- EXPERIMENT HANDLERS -----
  const handleEditExperiment = (exp) => {
    setSelectedExperiment(exp);
    setFormValues({ ...exp });
    setPopupMode("edit");
    setIsExperimentPopupOpen(true);
  };

  const handleSaveExperiment = async () => {
    if (!formValues.exp_no || !formValues.exp_name || !formValues.exp_description) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (popupMode === "edit") {
        // Edit experiment
        const res = await axios.put(
         `${import.meta.env.VITE_SERVER_APP_URL}/${selectedCourse._id}/experiments/${selectedExperiment._id}`,
          {
            exp_no: Number(formValues.exp_no),
            exp_name: formValues.exp_name,
            exp_description: formValues.exp_description,
          }
        );

        const updatedCourse = {
          ...selectedCourse,
          experiments: selectedCourse.experiments.map((exp) =>
            exp._id === selectedExperiment._id ? res.data.Exp : exp
          ),
        };

        onUpdateCourse(updatedCourse);
        setSelectedCourse(updatedCourse);
        alert("Experiment updated successfully!");
      } else {
        // Add new experiment
        
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_APP_URL}/courses/${selectedCourse._id}/experiments`,
          {
            exp_no: Number(formValues.exp_no),
            exp_name: formValues.exp_name,
            exp_description: formValues.exp_description,
          }
        );

        const updatedCourse = {
          ...selectedCourse,
          experiments: [...selectedCourse.experiments, res.data.Exp],
        };

        onUpdateCourse(updatedCourse);
        setSelectedCourse(updatedCourse);
        alert("Experiment added successfully!");
      }

      // Reset popup
      setFormValues({ exp_no: "", exp_name: "", description: "" });
      setIsExperimentPopupOpen(false);
      setSelectedExperiment(null);
    } catch (err) {
      console.error("Error saving experiment:", err);
      alert("Failed to save experiment");
    }
  };

  const handleOpenAddPopup = () => {
    setFormValues({ exp_no: "", exp_name: "", description: "" });
    setPopupMode("add");
    setIsExperimentPopupOpen(true);
  };

  return (
    <div className="table-wrapper">
      {/* COURSES TABLE */}
      <div className="teacher-table">
        <table>
          <thead>
            <tr>
            <th>S.No</th>
              <th>Course Name</th>
              <th>Course Code</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course,index) => (
              <tr key={index}>
                <td>{(pagination - 1) * 5 + (index + 1)}</td>
                <td>{course.Course_name}</td>
                <td>{course.Course_id}</td>
                <td>{course.dept}</td>
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
      {selectedCourse && (
        <div className="teacher-table" style={{ marginTop: "20px" }}>
          <h3>{selectedCourse.Course_name} - Experiments</h3>
          <button
            className="add-btn"
            style={{ width: "30px", height: "30px" }}
            onClick={handleOpenAddPopup}
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
                  <td>{exp.exp_description}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditExperiment(exp)}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EXPERIMENT POPUP */}
      <AddPopup
        title={popupMode === "add" ? "Add New Experiment" : "Edit Experiment"}
        open={isExperimentPopupOpen}
        onClose={() => setIsExperimentPopupOpen(false)}
        onSave={handleSaveExperiment}
        values={formValues}
        setValues={setFormValues}
        fields={["exp_no", "exp_name", "exp_description"]}
      />
</div>
);
}
