import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookIcon from "@mui/icons-material/Book";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupIcon from "@mui/icons-material/Group";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import "./student-landing.css";
import "./student-history.css"
import "../teacher/teacher-landing.css";
import LoginPopup from "../login/loginPopup";
import MiniAppBar from "../../components/Student_navbar";
import {
  FaBookOpen,
  FaClipboardList,
  FaClock,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";
import axios from "axios";

const StudentHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userDept =
    location?.state?.Studentdept || localStorage.getItem("student_dept");
  const userId =
    location?.state?.student_id || localStorage.getItem("student_id");

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  useEffect(() => {
    if (userDept) {
      axios
        .post(`${import.meta.env.VITE_SERVER_APP_URL}/history`, {
          dept: userDept,
          Student_id: userId,
        })
        .then((response) => {
          setCourses(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch courses:", error);
        });

      //   fetchMyBookings();
    } else {
      alert("Please login first!");
      navigate("/");
    }
  }, [userDept, navigate]);

  const filterSlots = (slots) => {
    return slots.filter((slot) => {
      const matchesSearch =
        slot.Course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.venue.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate =
        !filterDate ||
        new Date(slot.Date).toISOString().split("T")[0] === filterDate;

      return matchesSearch && matchesDate;
    });
  };

  const filteredCourses = filterSlots(courses);

  return (
    <>
      <MiniAppBar />
      <h2 style={{
        marginLeft:"10px"
      }}>Slot History</h2>
      <div className="filter-bar-history">
        <input
          type="text"
          placeholder="Search slots by title or lab name..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="date-filter">
          <FaFilter color="#555" />
          <input
            type="date"
            className="date-text"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>
      {/* Slot List */}
      <div className="slot-list">
        {/* Available Slots */}

        <>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((slot) => (
              <div key={slot._id} className="slot-card">
                <div className="slot-header">
                  <h3>
                    {slot.Course} - Exp.No:{slot.experiment.exp_no}
                    <span className="your-slot-badge">
                      Faculty: {slot.Staff_name}
                    </span>
                  </h3>
                </div>

                <p
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <BookIcon fontSize="small" />
                  {new Date(slot.Date).toDateString()}
                </p>

                <p
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <AccessTimeIcon fontSize="small" />
                  {slot.Time}
                </p>

                <p
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <LocationOnIcon fontSize="small" />
                  {slot.venue}
                </p>

                <p
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <PictureAsPdfIcon fontSize="small" />
                  <a
                    href={slot.pdf_material}
                    style={{
                      textDecoration: "none",
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pdf Material
                  </a>
                </p>

                <p
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <OndemandVideoIcon fontSize="small" />
                  <a
                    href={slot.video_material}
                    style={{
                      textDecoration: "none",
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Video Material
                  </a>
                </p>
                
              </div>
            ))
          ) : (
            <div className="no-slots">
              <FaCalendarAlt size={60} color="#c0c0c0" />
              <h4>No available slots</h4>
              <p>Try adjusting search, date, or faculty filters</p>
              {(filterDate != "" || searchTerm != "") && (
                <button
                  className="clear-btn"
                  onClick={(e) => {
                    setFilterDate(""), setSearchTerm("");
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </>
      </div>
    </>
  );
};

export default StudentHistory;
