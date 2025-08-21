import React, { useState } from "react";
import CourseTable from "./coursetable";
import LocationTable from "./locationtable";
import "./updatesubject.css"

export default function UpdateSubject() {
  // Dummy data for testing
  const [courses, setCourses] = useState([
    { course_name: "IoT", course_code: "CSE401" },
    { course_name: "POC", course_code: "ECE305" },
  ]);

  const [locations, setLocations] = useState([
    { lab_name: "Mech Lab 1", department: "Mechanical" },
    { lab_name: "CSE Lab 5", department: "CSE" },
  ]);

  // Handlers for course
  const handleEditCourse = (course) => {
    console.log("Edit course:", course);
  };

  const handleDeleteCourse = (courseCode) => {
    setCourses(courses.filter((c) => c.course_code !== courseCode));
  };

  // Handlers for location
  const handleEditLocation = (location) => {
    console.log("Edit location:", location);
  };

  const handleDeleteLocation = (labName) => {
    setLocations(locations.filter((l) => l.lab_name !== labName));
  };

  return (
    <div className="page-container">
    <div className="update-subject-page">
      <h2>Update Subject</h2>

      <div className="table-section">
        <h3>Courses</h3>
        <CourseTable
          data={courses}
          onEdit={handleEditCourse}
          onDelete={handleDeleteCourse}
        />
      </div>

      <div className="table-section">
        <h3>Locations</h3>
        <LocationTable
          data={locations}
          onEdit={handleEditLocation}
          onDelete={handleDeleteLocation}
        />
      </div>
      </div>
    </div>
  );
}
