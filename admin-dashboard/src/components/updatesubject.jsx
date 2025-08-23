import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseTable from "./coursetable";
import LocationTable from "./locationtable";
import "./updatesubject.css";

export default function UpdateSubject() {
  const [courses, setCourses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [lab, setLab] = useState("");
  const [dept, setDept] = useState("");

  const [showCoursePopup, setShowCoursePopup] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  const [newCourse, setNewCourse] = useState({
    course_name: "",
    course_code: "",
    department: "",
    experiments: []
  });

  const [newLocation, setNewLocation] = useState({
    lab_name: "",
    department: ""
  });

  // Fetch courses from backend
  useEffect(() => {
    axios.get("http://localhost:4000/courses")
      .then(res => setCourses(res.data))
      .catch(err => console.error("Error fetching courses:", err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:4000/locations")
      .then(res => setLocations(res.data))
      .catch(err => console.error("Error fetching Locations:", err));
  }, []);

  // Add new course
  const handleSubmitCourse = () => {
    if (!newCourse.course_name || !newCourse.course_code || !newCourse.department) {
      alert("Please fill all fields");
      return;
    }

    axios.post("http://localhost:4000/courses", newCourse)
      .then(res => {
        setCourses([...courses, res.data]);
        setNewCourse({ course_name: "", course_code: "", department: "", experiments: [] });
        setShowCoursePopup(false);
      })
      .catch(err => console.error("Error adding course:", err));
  };

  // Delete course (using _id)
  const handleDeleteCourse = (courseId) => {
    axios.delete(`http://localhost:4000/courses/${courseId}`)
      .then(() => {
        setCourses(courses.filter(c => c._id !== courseId));
      })
      .catch(err => console.error("Error deleting course:", err));
  };

  // Add new experiment
  const handleAddExperiment = (courseId, exp) => {
    axios.post(`http://localhost:4000/courses/${courseId}/experiments`, exp)
      .then(res => {
        setCourses(courses.map(c => c._id === courseId ? res.data : c));
      })
      .catch(err => console.error("Error adding experiment:", err));
  };

  // Update experiment
  const handleUpdateExperiment = (courseId, expId, updatedExp) => {
    axios.put(`http://localhost:4000/courses/${courseId}/experiments/${expId}`, updatedExp)
      .then(res => {
        setCourses(courses.map(c => c._id === courseId ? res.data : c));
      })
      .catch(err => console.error("Error updating experiment:", err));
  };

  // Add new location
  const handleSubmitLocation = () => {
    if (!lab || !dept) {
      alert("Please fill all fields");
      return;
    }
    axios.post("http://localhost:4000/locations", {
  lab: lab,
  dept:dept

})
.then(res => {
  setLocations([...locations, res.data]); // Use backend response
  setNewLocation({ lab_name: "", department: "" });
  setShowLocationPopup(false);
})
.catch(err => console.error("Error updating location:", err));

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
          <div className="section-header">
            <h3>Locations</h3>
            <button className="add-btn" onClick={() => setShowLocationPopup(true)}>+</button>
          </div>
          <LocationTable
            data={locations}
            onDelete={labName => setLocations(locations.filter(l => l.lab_name !== labName))}
          />
        </div>

        {/* Add Course Popup */}
        {showCoursePopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h3>Add New Course</h3>
              <label>Course Name:
                <input type="text" value={newCourse.course_name} onChange={e => setNewCourse({ ...newCourse, course_name: e.target.value })} />
              </label>
              <label>Course Code:
                <input type="text" value={newCourse.course_code} onChange={e => setNewCourse({ ...newCourse, course_code: e.target.value })} />
              </label>
              <label>Department:
                <input type="text" value={newCourse.department} onChange={e => setNewCourse({ ...newCourse, department: e.target.value })} />
              </label>
              <div style={{ marginTop: "10px" }}>
                <button className="edits-btn" onClick={handleSubmitCourse}>Submit</button>
                <button className="deletes-btn" onClick={() => setShowCoursePopup(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Location Popup */}
        {showLocationPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h3>Add New Location</h3>
              <label>Lab Name:
                <input type="text" value={lab} onChange={e => setLab(e.target.value)} />
              </label>
              <label>Department:
                <input type="text" value={dept} onChange={e => setDept(e.target.value)} />
              </label>
              <div style={{ marginTop: "10px" }}>
                <button className="edits-btn" onClick={handleSubmitLocation}>Submit</button>
                <button className="deletes-btn" onClick={() => setShowLocationPopup(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
