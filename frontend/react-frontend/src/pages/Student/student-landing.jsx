import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import BookIcon from "@mui/icons-material/Book";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupIcon from "@mui/icons-material/Group";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
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
  const userId =
    location?.state?.Student_id || localStorage.getItem("Student_id");

  const [courses, setCourses] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [active, setActive] = useState("available");

  useEffect(() => {
    if (userDept) {
      axios
        .post(`http://localhost:4000/slots`, {
          dept: userDept,
          Student_id:userId
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
      navigate("/")
      console.log("User department not found. Redirecting to login.");
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
        setCourses((prev) => prev.filter((slot) => slot._id !== Slot_id));

        axios
          .post(`http://localhost:4000/slots`, {
            dept: userDept,
            Student_id: userId,
          })
          .then((response) => setCourses(response.data));
        fetchMyBookings();
      })
      .catch((err) => console.log("Error Booking Slot:", err));
  };

  const fetchMyBookings = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/student/my-bookings`,
        {
          Student_id: userId,
        }
      );
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
                className={`tab ${
                  active === "available" ? "active" : "inactive"
                }`}
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
                <input
                  type="text"
                  placeholder="dd-mm-yyyy"
                  className="date-text"
                />
                <FaCalendarAlt color="#555" />
              </div>
            </div>

            {/* Slot List */}
            <div className="slot-list">
              {/* Available Slots */}
              {active === "available" && (
                <>
                  {courses.length > 0 ? (
                    courses.map((slot) => (
                      <div key={slot._id} className="slot-card">
                        <div className="slot-header">
                          <h3>
                            {slot.Course}{" "}
                            <span className="your-slot-badge">Your Slot</span>
                          </h3>
                        </div>

                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <BookIcon fontSize="small" />
                          {new Date(slot.Date).toDateString()}
                        </p>

                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <AccessTimeIcon fontSize="small" />
                          {slot.Time}
                        </p>

                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <LocationOnIcon fontSize="small" />
                          {slot.venue}
                        </p>

                        {/* <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <GroupIcon fontSize="small" />
                          0/{slot.capacity} Capacity
                        </p> */}

                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <PictureAsPdfIcon fontSize="small" />
                          <a
                            href={slot.pdf_material}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            Pdf Material
                          </a>
                        </p>

                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <OndemandVideoIcon fontSize="small" />
                          <a
                            href={slot.video_material}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            Video Material
                          </a>
                        </p>
                        <button
                          className="book-btn"
                          onClick={() => handleBookSlot(slot._id)}
                        >
                          Book Now
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="no-slots">
                      <FaCalendarAlt size={60} color="#c0c0c0" />
                      <h4>No available slots</h4>
                      <p>Check back later for new lab sessions</p>
                    </div>
                  )}
                </>
              )}

              {/* Booked Slots */}
              {active === "booked" && (
                <>
                  {myBookings.length > 0 ? (
                    myBookings.map((slot) => (
                      <div key={slot._id} className="slot-card">
                        <div className="slot-header">
                          <h3>
                            {slot.Course}{" "}
                            <span className="your-slot-badge">Your Slot</span>
                          </h3>
                        </div>

                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <BookIcon fontSize="small" />
                          {new Date(slot.Date).toDateString()}
                        </p>

                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <AccessTimeIcon fontSize="small" />
                          {slot.Time}
                        </p>

                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <LocationOnIcon fontSize="small" />
                          {slot.venue}
                        </p>

                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <GroupIcon fontSize="small" />
                          0/{slot.capacity} Capacity
                        </p>

                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <PictureAsPdfIcon fontSize="small" />
                          <a
                            href={slot.pdf_material}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            Pdf Material
                          </a>
                        </p>

                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <OndemandVideoIcon fontSize="small" />
                          <a
                            href={slot.video_material}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            Video Material
                          </a>
                        </p>
                        <button className="remove-btn-bottom-right">Cancel</button>
                      </div>
                    ))
                  ) : (
                    <div className="no-slots">
                      <FaCalendarAlt size={60} color="#c0c0c0" />
                      <h4>No booked slots</h4>
                      <p>You haven’t booked any slots yet.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
};

export default CourseList;
