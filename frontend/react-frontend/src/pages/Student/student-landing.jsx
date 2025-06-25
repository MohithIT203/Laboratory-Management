import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./student-landing.css";
import MiniAppBar from "../../components/navbar";
import {
  FaBookOpen,
  FaClipboardList,
  FaClock,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";
import axios from "axios";

const CourseList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userDept = location?.state?.Studentdept;

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (userDept) {
      axios
        .get(`http://localhost:4000/student/courses/${userDept}`)
        .then((response) => {
          setCourses(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch courses:", error);
        });
    } else {
      alert("Please login first!");
      navigate("/login");
    }
  }, [userDept, navigate]);

  return (
    <>
      <MiniAppBar />
      <div className="wrapper">
        <div className="course_content">
          <h3 className="section-title">SLOTS AVAILABLE</h3>

          {/* Dashboard Cards */}
          <div className="carddiv">
            <div className="stucard">
              <div className="card-header">
                <p>My Bookings</p>
                <FaBookOpen size={24} color="#4caf50" />
              </div>
              <h3>10</h3>
            </div>

            <div className="stucard">
              <div className="card-header">
                <p>Total Bookings</p>
                <FaClipboardList size={24} color="#2196f3" />
              </div>
              <h3>50</h3>
            </div>

            <div className="stucard">
              <div className="card-header">
                <h3>Next Session</h3>
                <FaClock size={22} color="#f57c00" />
              </div>
              <h4 className="session-time">(10:50 AM – 12:30 PM)</h4>
              <h3>DBMS – IT Lab 2</h3>
            </div>
          </div>

          {/* Tabs */}
          <div className="tab-section">
            <div className="tabs">
              <div className="tab active">Available Slots</div>
              <div className="tab inactive">My Bookings (0)</div>
            </div>

            {/* Filters */}
            <div className="filter-bar">
              <input
                type="text"
                placeholder="Search slots by title or lab name..."
                className="search-input"
              />
              <div className="date-filter">
                <FaFilter color="#555" />
                <input
                  type="text"
                  placeholder="dd-mm-yyyy"
                  className="date-text"
                />
                <FaCalendarAlt color="#555" />
              </div>
            </div>

            {/* Course Cards */}
            {courses.length > 0 ? (
              <div className="allItems">
                {courses.map((course) => (
                  <div key={course.Course_id} className="content">
                    <h3 style={{ margin: "10px 10px 10px 0px" }}>
                      {course.Course_name}
                    </h3>
                    <p style={{ margin: "0px", fontSize: "17px" }}>Faculties:</p>
                    <ol className="list_item">
                      {(course.Staff_name || []).length > 0 ? (
                        course.Staff_name.map((name, index) => (
                          <li key={index}>{name}</li>
                        ))
                      ) : (
                        <li>No faculty listed</li>
                      )}
                    </ol>
                    <button>View Details</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-slots">
                <FaCalendarAlt size={60} color="#c0c0c0" />
                <h4>No available slots</h4>
                <p>Check back later for new lab sessions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseList;
