import React, { useState } from "react";
import CourseTable from "./coursetable";
import LocationTable from "./locationtable";
import "./updatesubject.css";

export default function UpdateSubject() {
  const [courses, setCourses] = useState([
    {
      course_name: "IoT",
      course_code: "IOT101",
      department: "CSE",
      experiments: [
        { exp_no: 1, exp_name: "Introduction to Sensors", description: "Basics of sensor interfacing" },
        { exp_no: 2, exp_name: "Smart Home Automation", description: "Build a home automation system using Arduino + IoT" }
      ]
    },
    {
      course_name: "POC",
      course_code: "POC202",
      department: "ECE",
      experiments: [
        { exp_no: 1, exp_name: "Cloud Integration", description: "Hands-on with AWS services" },
        { exp_no: 2, exp_name: "ML Deployment", description: "Deploy ML model on cloud platform" }
      ]
    }
  ]);

  const [locations, setLocations] = useState([
    { lab_name: "Mech Lab 1", department: "Mechanical" },
    { lab_name: "CSE Lab 5", department: "CSE" },
  ]);

  const [showCoursePopup, setShowCoursePopup] = useState(false);
  const [newCourse, setNewCourse] = useState({
    course_name: "",
    course_code: "",
    department: "",
    experiments: []
  });

  // Add new course
  const handleSubmitCourse = () => {
    if (!newCourse.course_name || !newCourse.course_code || !newCourse.department) {
      alert("Please fill all course fields");
      return;
    }
    setCourses([...courses, newCourse]);
    setNewCourse({ course_name: "", course_code: "", department: "", experiments: [] });
    setShowCoursePopup(false);
  };

  // Delete course
  const handleDeleteCourse = (courseCode) => {
    setCourses(courses.filter(c => c.course_code !== courseCode));
  };

  // Update experiment in existing courses
  const handleUpdateExperiment = (courseCode, updatedExperiment) => {
    const { oldExpNo, ...newExp } = updatedExperiment;
    setCourses(courses.map(c =>
      c.course_code === courseCode
        ? {
            ...c,
            experiments: c.experiments.map(exp =>
              exp.exp_no === oldExpNo ? newExp : exp
            )
          }
        : c
    ));
  };

  // Add experiment to course (after viewing course)
  const handleAddExperiment = (courseCode, exp) => {
    setCourses(courses.map(c =>
      c.course_code === courseCode
        ? { ...c, experiments: [...c.experiments, exp] }
        : c
    ));
  };

  return (
    <div className="page-container">
      <div className="update-subject-page">
        <h2>Update Subject</h2>

        {/* Courses Section */}
        <div className="table-section">
          <div className="section-header">
            <h3>Courses</h3>
            <button className="add-btn" onClick={() => setShowCoursePopup(true)}>+</button>
          </div>
          <CourseTable
            courses={courses}
            onDeleteCourse={handleDeleteCourse}
            onAddExperiment={handleAddExperiment}
            onUpdateExperiment={handleUpdateExperiment}
          />
        </div>

        {/* Locations Section */}
        <div className="table-section">
          <h3>Locations</h3>
          <LocationTable
            data={locations}
            onEdit={() => {}}
            onDelete={labName => setLocations(locations.filter(l => l.lab_name !== labName))}
          />
        </div>

        {/* Add Course Popup */}
        {showCoursePopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h3>Add New Course</h3>
              <label>
                Course Name:
                <input
                  type="text"
                  value={newCourse.course_name}
                  onChange={e => setNewCourse({ ...newCourse, course_name: e.target.value })}
                />
              </label>
              <label>
                Course Code:
                <input
                  type="text"
                  value={newCourse.course_code}
                  onChange={e => setNewCourse({ ...newCourse, course_code: e.target.value })}
                />
              </label>
              <label>
                Department:
                <input
                  type="text"
                  value={newCourse.department}
                  onChange={e => setNewCourse({ ...newCourse, department: e.target.value })}
                />
              </label>

              <div style={{ marginTop: "10px" }}>
                <button className="edits-btn" onClick={handleSubmitCourse}>Submit</button>
                <button className="deletes-btn" onClick={() => setShowCoursePopup(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
