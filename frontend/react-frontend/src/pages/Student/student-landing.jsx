import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import BookIcon from "@mui/icons-material/Book";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupIcon from "@mui/icons-material/Group";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ScienceIcon from "@mui/icons-material/Science";
import "./student-landing.css";
import "../teacher/teacher-landing.css";
import LoginPopup from "../login/loginPopup";
import MiniAppBar from "../../components/Student_navbar";
import CircularProgress from "@mui/material/CircularProgress";
import {
  FaBookOpen,
  FaClipboardList,
  FaClock,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";
import toast from 'react-hot-toast';
import axios from "axios";

const CourseList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userDept =
    location?.state?.Studentdept || localStorage.getItem("student_dept");
  const userId =
    location?.state?.student_id || localStorage.getItem("student_id");

  const [courses, setCourses] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [active, setActive] = useState("available");
  const [bookingSlotId, setBookingSlotId] = useState(null);

  // filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const availableslots =async ()=>{
    axios
        .post(`${import.meta.env.VITE_SERVER_APP_URL}/slots`, {
          dept: userDept,
          Student_id: userId,
        })
        .then((response) => {
          setCourses(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch courses:", error);
        });
  } 
  useEffect(() => {
    if (userDept) {
      availableslots();
      fetchMyBookings();
    } else {
      alert("Please login first!");
      navigate("/");
    }
  }, [userDept, navigate]);

  const handleBookSlot = (Slot_id) => {
    setBookingSlotId(Slot_id);
    axios
      .post(`${import.meta.env.VITE_SERVER_APP_URL}/student/book-slot`, {
        Slot_id,
        Student_id: userId,
      })
      .then(() => {
        setCourses((prev) => prev.filter((slot) => slot._id !== Slot_id));
        return axios.post(`${import.meta.env.VITE_SERVER_APP_URL}/slots`, {
          dept: userDept,
          Student_id: userId,
        });
      })
      .then((response) => {
        setCourses(response.data);
        fetchMyBookings();
      })
      .catch((error) => {
       console.error(error.response?.data?.message || "Error booking slot");
        if (error.response) {
          console.error("Error:", error.response.data.message);
          <LoginPopup
            type={"critical"}
            message={error.response.data.message}
          />;
        } else {
          console.error("Unexpected Error:", error);
        }
        
      })
      .finally(() => {

        setBookingSlotId(null);
      });
  };

  const fetchMyBookings = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_APP_URL}/student/my-bookings`,
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
    if (tab === "available") availableslots();
  };

  const handleCancelSlot = async (slotId) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_SERVER_APP_URL
        }/student/cancel-slot/${slotId}/${userId}`
      );

      setMyBookings((prev) => prev.filter((slot) => slot._id !== slotId));
      toast.success("Slot Cancelled Successfully!!");
    } catch (err) {
      console.error("Error Deleting Slot:", err);
      toast.error("An Error Occurred");
    }
  };

  // 🔹 filtering logic
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
  const filteredBookings = filterSlots(myBookings);

  return (
    <>
      <MiniAppBar />
      <div className="wrapper">
        <div className="course_content">
          <h3 className="section-title">ALL SLOTS</h3>

          {/* Dashboard Cards */}
          <div className="carddiv">
            <div className="stucard">
              <div className="card-header">
                <p>My Bookings</p>
                <FaBookOpen size={24} color="#4caf50" />
              </div>
              <h3 style={{ fontSize: "25px" }}>{myBookings.length}</h3>
            </div>

            <div className="stucard">
              <div className="card-header">
                <p>Total Slots</p>
                <FaClipboardList size={24} color="#2196f3" />
              </div>
              <h3 style={{ fontSize: "25px" }}>
                {courses.length + myBookings.length}
              </h3>
            </div>

            <div className="stucard">
              <div className="card-header">
                <h3>Next Session</h3>
                <FaClock size={22} color="#f57c00" />
              </div>

              <h4 className="session-time">{myBookings[0]?.Time}</h4>
              <h4>
                {myBookings[0]?.Course.toUpperCase()} - {myBookings[0]?.venue}
              </h4>
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
              {active === "available" && (
                <>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((slot) => (
                      <div key={slot._id} className="slot-card">
                        <div className="slot-header">
                          <h3>
                            {slot.Course}
                            <span className="your-slot-badge">
                              Faculty: {slot.Staff_name}
                            </span>
                          </h3>
                        </div>
                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <ScienceIcon fontSize="small" />
                          <strong>Exp.No:{slot.experiment.exp_no}</strong>
                        </p>

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
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
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
                        <button
                          className="book-btn"
                          disabled={bookingSlotId === slot._id}
                          onClick={() => handleBookSlot(slot._id)}
                        >
                          {bookingSlotId === slot._id ? (
                            <>
                              <CircularProgress size={16} color="inherit" />{" "}
                              Booking...
                            </>
                          ) : (
                            "Book Now"
                          )}
                        </button>
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
              )}

              {/* Booked Slots */}
              {active === "booked" && (
                <>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((slot) => (
                      <div key={slot._id} className="slot-card">
                        <div className="slot-header">
                          <h3>
                            {slot.Course}
                            <span className="your-slot-badge">
                              Faculty: {slot.Staff_name}
                            </span>
                          </h3>
                        </div>
                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <ScienceIcon fontSize="small" />
                          <strong>Exp.No:{slot.experiment.exp_no}</strong>
                        </p>
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
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
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
                        <button
                          className="remove-btn-bottom-right"
                          onClick={() => {
                            handleCancelSlot(slot._id);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="no-slots">
                      <FaCalendarAlt size={60} color="#c0c0c0" />
                      <h4>No booked slots</h4>
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseList;
