import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./student-landing.css";
import "../teacher/teacher-landing.css";
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
  const userId = location?.state?.Student_id || localStorage.getItem("Student_id");

  const [courses, setCourses] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [active, setActive] = useState("available");

  useEffect(() => {
    if (userDept) {
      axios
        .post(`http://localhost:4000/student/slots`, {
          dept: userDept,
        })
        .then((response) => {
          setCourses(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch courses:", error);
        });

        fetchMyBookings();
    } else {
      alert("Please login first!");
      navigate("/");
    }
  }, [userDept, navigate]);

 const handleBookSlot = (Slot_id) => {
  axios
    .post(`http://localhost:4000/student/book-slot`, {
      Slot_id,
      Student_id: userId,
      isBooked: true,
    })
    .then(() => {
      setCourses((prev) => prev.filter(slot => slot._id !== Slot_id));
      
      axios
        .post(`http://localhost:4000/student/slots`, {
          dept: userDept,
          Student_id: userId
        })
        .then((response) => setCourses(response.data));
      fetchMyBookings();
    })
    .catch((err) => console.log("Error Booking Slot:", err));
};


  const fetchMyBookings = async () => {
    try {
        const response = await axios.post(`http://localhost:4000/student/my-bookings`, {
        Student_id: userId,
      });
      setMyBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const handleTabChange = (tab) => {
    setActive(tab);
    if (tab === "booked") fetchMyBookings();
  };

  return (
    <>
      <MiniAppBar />
      <div className="wrapper">
        <div className="course_content">
          <h3 className="section-title">SLOTS</h3>

          {/* Dashboard Cards */}
          <div className="carddiv">
            <div className="stucard">
              <div className="card-header">
                <p>My Bookings</p>
                <FaBookOpen size={24} color="#4caf50" />
              </div>
              <h3>{myBookings.length}</h3>
            </div>

            <div className="stucard">
              <div className="card-header">
                <p>Total Slots</p>
                <FaClipboardList size={24} color="#2196f3" />
              </div>
              <h3>{courses.length + myBookings.length}</h3>
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
              <div
                className={`tab ${active === "available" ? "active" : "inactive"}`}
                onClick={() => handleTabChange("available")}
              >
                Available Slots
              </div>
              <div
                className={`tab ${active === "booked" ? "active" : "inactive"}`}
                onClick={() => handleTabChange("booked")}
              >
                My Bookings ({myBookings.length})
              </div>
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
                <input type="text" placeholder="dd-mm-yyyy" className="date-text" />
                <FaCalendarAlt color="#555" />
              </div>
            </div>

            {/* Slot List */}
            <div className="slot-list">
              {active === "available" &&
                courses.map((slot) => (
                  <div key={slot._id} className="slot-card">
                    <div className="slot-header">
                      <h3>
                        {slot.Course}{" "}
                        <span className="your-slot-badge">Faculty: {slot.Staff_name}</span>
                      </h3>
                    </div>
                    <p><b>📅</b> {new Date(slot.Date).toDateString()}</p>
                    <p><b>⏰</b> {slot.Time}</p>
                    <p><b>📍</b> {slot.venue}</p>
                    <p><b>📑 </b><a href={slot.pdf_material} target="_blank" style={{textDecoration:"none"}}>Pdf Material</a></p>
                    <p><b>📓 </b><a href={slot.video_material} target="_blank" style={{textDecoration:"none"}}>Video Material</a></p>
                    <button className="book-btn" onClick={() => handleBookSlot(slot._id)}>
                      Book Now
                    </button>
                  </div>
                ))}

              {active === "booked" &&
                myBookings.map((slot) => (
                  <div key={slot._id} className="slot-card booked">
                    <div className="slot-header">
                      <h3>
                        {slot.Course}{" "}
                        <span className="your-slot-badge">Faculty: {slot.Staff_name}</span>
                      </h3>
                    </div>
                    <p><b>📅</b> {new Date(slot.Date).toDateString()}</p>
                    <p><b>⏰</b> {slot.Time}</p>
                    <p><b>📍</b> {slot.venue}</p>
                    <p><b>📑 </b><a href={slot.pdf_material} target="_blank">Pdf Material</a></p>
                    <p><b>📓 </b><a href={slot.video_material} target="_blank">Video Material</a></p>
                    <p style={{ color: "#4caf50" }}><b>✅ Booked</b></p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseList;
