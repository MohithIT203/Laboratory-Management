import React, { useEffect, useState } from "react";
import "./student-landing.css";
import {
  FaBookOpen,
  FaClipboardList,
  FaClock,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";

const CourseList = () => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const savedSlots = localStorage.getItem("createdSlots");
    if (savedSlots) {
      setSlots(JSON.parse(savedSlots));
    }
  }, []);

  return (
    <div className="wrapper">
      <div className="course_content">
        <h3 className="section-title">SLOTS AVAILABLE</h3>

        <div className="carddiv">
          {/* My Bookings */}
          <div className="stucard">
            <div className="card-header">
              <p>My Bookings</p>
              <FaBookOpen size={24} color="#4caf50" />
            </div>
            <h3>10</h3>
          </div>

          {/* Total Bookings */}
          <div className="stucard">
            <div className="card-header">
              <p>Total Bookings</p>
              <FaClipboardList size={24} color="#2196f3" />
            </div>
            <h3>50</h3>
          </div>

          {/* Next Session */}
          <div className="stucard">
            <div className="card-header">
              <h3>Next Session</h3>
              <FaClock size={22} color="#f57c00" />
            </div>
            <h4 className="session-time">(10:50 AM – 12:30 PM)</h4>
            <h3>DBMS – IT Lab 2</h3>
          </div>
        </div>

        {/* Tab Section */}
        <div className="tab-section">
          <div className="tabs">
            <div className="tab active">Available Slots</div>
            <div className="tab inactive">My Bookings (0)</div>
          </div>

          {/* Search & Filter */}
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

          {/* No Slots Available */}
          <div className="no-slots">
            <FaCalendarAlt size={60} color="#c0c0c0" />
            <h4>No available slots</h4>
            <p>Check back later for new lab sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseList;
