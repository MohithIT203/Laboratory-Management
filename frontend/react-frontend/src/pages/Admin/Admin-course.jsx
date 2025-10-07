// src/pages/AdminCourse.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseTable from "../../components/CourseTable/CourseTable";
import LocationTable from "../../components/LocationTable/LocationTable";
import AddPopup from "../../components/AddPopup/AddPopup";
import { FaSearch } from "react-icons/fa";
import "./Admin-course.css";
import AdminAppBar from "../../components/Admin_navbar";

export default function AdminCourse() {
  const [courses, setCourses] = useState([]);
  const [locations, setLocations] = useState([]);

  // Forms
  const [newCourse, setNewCourse] = useState({
    course_name: "",
    course_code: "",
    department: "",
  });
  const [newLocation, setNewLocation] = useState({
    lab_name: "",
    capacity: "",
  });

  // Popup state
  const [isCoursePopupOpen, setIsCoursePopupOpen] = useState(false);

  // Pagination states
  const [coursePage, setCoursePage] = useState(1);
  const coursesPerPage = 5;
  const [locationPage, setLocationPage] = useState(1);
  const locationsPerPage = 5;

  // Search & Filter state
  const [courseSearch, setCourseSearch] = useState("");
  const [courseDeptFilter, setCourseDeptFilter] = useState("all");

  // Fetch courses
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_APP_URL}/courses`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  // Fetch locations
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_APP_URL}/locations`)
      .then((res) => setLocations(res.data))
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  // Add experiment
  const handleAddExperiment = (courseId, newExperiment) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course._id === courseId
          ? {
              ...course,
              experiments: [...(course.experiments || []), newExperiment],
            }
          : course
      )
    );
  };

  // ========== COURSES ==========
  const handleSaveCourse = () => {
    const { course_name, course_code, department } = newCourse;
    if (!course_name || !course_code || !department) {
      alert("Please fill all fields");
      return;
    }
    axios
      .post(`${import.meta.env.VITE_SERVER_APP_URL}/courses`, newCourse)
      .then((res) => {
        setCourses((prev) => [...prev, res.data.course]);
        setNewCourse({ course_name: "", course_code: "", department: "" });
        setIsCoursePopupOpen(false);
      })
      .catch((err) => console.error("Error adding course:", err));
  };

  const handleDeleteCourse = (courseId) => {
    axios
      .delete(`${import.meta.env.VITE_SERVER_APP_URL}/courses/${courseId}`)
      .then(() => {
        setCourses((prev) => prev.filter((c) => c._id !== courseId));
      })
      .catch((err) => console.error("Error deleting course:", err));
  };

  const handleUpdateCourse = (updatedCourse) => {
    setCourses((prev) =>
      prev.map((course) =>
        course._id === updatedCourse._id ? updatedCourse : course
      )
    );
  };

  const handleSubmitLocation = async (e) => {
    e.preventDefault();
    if (
      !newLocation.lab_name ||
      !newLocation.lab_name.trim() ||
      !newLocation.capacity
    ) {
      alert("Please enter a lab name and valid capacity");
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_APP_URL}/locations`,
        {
          name: newLocation.lab_name.trim(),
          capacity: Number(newLocation.capacity),
        }
      );
      const newLoc = {
    lab_name: res.data.Lab_name,
    capacity: res.data.capacity,
  };

  setLocations((prev) => [...prev, newLoc]);
      setNewLocation({ lab_name: "", capacity: "" });
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert("Location already exists");
      } else {
        console.error("Error adding location:", err);
      }
    }
  };

  const handleDeleteLocation = async (locationId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_APP_URL}/locations/${locationId}`
      );
      setLocations((prev) => prev.filter((loc) => loc._id !== locationId));
    } catch (err) {
      console.error("Error deleting location:", err);
    }
  };

  // Reset pages when data changes
  useEffect(() => setCoursePage(1), [courses]);
  useEffect(() => setLocationPage(1), [locations]);

  // 🔍 Filter + Search Courses
  const filteredCourses = courses.filter(
    (c) =>
      (courseDeptFilter === "all" || c.department === courseDeptFilter) &&
      Object.values(c).some((value) =>
        String(value).toLowerCase().includes(courseSearch.toLowerCase())
      )
  );

  // Paginated Data
  const paginatedCourses = filteredCourses.slice(
    (coursePage - 1) * coursesPerPage,
    coursePage * coursesPerPage
  );

  const paginatedLocations = locations.slice(
    (locationPage - 1) * locationsPerPage,
    locationPage * locationsPerPage
  );

  return (
    <>
      <AdminAppBar />
      <div className="page-container">
        <div className="update-subject-page">
          <h2>Update Subject</h2>

          {/* Courses Section */}
          <div className="table-section">
            <div className="section-header">
              <h3>Courses</h3>
              <button
                className="add-btn"
                onClick={() => setIsCoursePopupOpen(true)}
              >
                +
              </button>
            </div>

            {/* 🔍 Search + Filter */}
            <div className="search-filter">
              <div className="search-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search Course..."
                  value={courseSearch}
                  className="search-bar"
                  onChange={(e) => setCourseSearch(e.target.value)}
                />
              </div>

              <select
                className="dept-filter"
                value={courseDeptFilter}
                onChange={(e) => setCourseDeptFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="EEE">EEE</option>
                <option value="IT">IT</option>
              </select>
            </div>

            {/* Courses Table */}
            <CourseTable
              courses={paginatedCourses}
              pagination={coursePage}
              onDeleteCourse={handleDeleteCourse}
              onUpdateCourse={handleUpdateCourse}
              onAddExperiment={handleAddExperiment}
            />

            {/* Pagination for Courses */}
            <div className="pagination-container">
              <div className="pagination-buttons">
                <button
                  className="pagination-btn"
                  disabled={coursePage === 1}
                  onClick={() => setCoursePage((prev) => prev - 1)}
                >
                  Previous
                </button>
                <span className="page-number">Page {coursePage}/{Math.ceil(filteredCourses.length/coursesPerPage)}</span>
                <button
                  className="pagination-btn"
                  disabled={
                    coursePage >=
                    Math.ceil(filteredCourses.length / coursesPerPage)
                  }
                  onClick={() => setCoursePage((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Locations Section */}
          <div className="table-section">
            <div className="section-header">
              <h3>Locations</h3>
            </div>

            {/* Input + Submit */}
            <div className="add-location-form">
              <input
                type="text"
                placeholder="Add location"
                value={newLocation.lab_name}
                onChange={(e) =>
                  setNewLocation({ ...newLocation, lab_name: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Capacity"
                min={1}
                value={newLocation.capacity}
                onChange={(e) =>
                  setNewLocation({ ...newLocation, capacity: e.target.value })
                }
              />

              <button className="add-btn" onClick={handleSubmitLocation}>
                Add Location
              </button>
            </div>

            <LocationTable
              data={paginatedLocations}
              pagination={locationPage}
              onDelete={handleDeleteLocation}
            />

            {/* Pagination for Locations */}
            <div className="pagination-container">
              <div className="pagination-buttons">
                <button
                  className="pagination-btn"
                  disabled={locationPage === 1}
                  onClick={() => setLocationPage((prev) => prev - 1)}
                >
                  Previous
                </button>
                <span className="page-number">Page {locationPage}/{Math.ceil(locations.length/locationsPerPage)}</span>
                <button
                  className="pagination-btn"
                  disabled={
                    locationPage >=
                    Math.ceil(locations.length / locationsPerPage)
                  }
                  onClick={() => setLocationPage((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Popup */}
        <AddPopup
          title="Add New Course"
          open={isCoursePopupOpen}
          onClose={() => setIsCoursePopupOpen(false)}
          onSave={handleSaveCourse}
          values={newCourse}
          setValues={setNewCourse}
          fields={["course_name", "course_code", "department"]}
        />
      </div>
    </>
  );
}
