import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useLocation } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import BookIcon from "@mui/icons-material/Book";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupIcon from "@mui/icons-material/Group";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import "./teacher-landing.css";
import axios from "axios";
import StaffAppBar from "../../components/Staff_navbar";

const SlotList = () => {
  const location = useLocation();
  const Facultyname =
    location.state?.Facultyname || localStorage.getItem("Facultyname");
  const Facultydept =
    location.state?.Facultydept || localStorage.getItem("Facultydept");
  const FacultyEmail =
    location.state?.FacultyEmail || localStorage.getItem("FacultyEmail");

  const [slots, setSlots] = useState([]);
  const [open, setOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [subjectOptions, setSubject] = useState([]);
  const [subject, setsubject] = useState("");
  const [date, setdate] = useState("");
  const [time, settime] = useState("");
  const [venue, setvenue] = useState("");
  const [capacity, setcapacity] = useState("");
  const [allslots, setallslots] = useState([]);
  const [materialLink, setmaterial] = useState(""); // string (fix)
  const [video, setvideo] = useState(""); // string (fix)
  const [error, seterror] = useState("");
  const [exp, setexp] = useState({});
  const [expDB, setexpDB] = useState([]);
  const [loading, setloading] = useState(false);
  const [slotLoading, setSlotLoading] = useState(true); // loader for all slots
  const [filterSortOption, setFilterSortOption] = useState("all-latest");

  const timeSlots = [
    "8:45 AM TO 10:30 AM",
    "10:50 AM TO 12:30 PM",
    "1:30 PM TO 3:00 PM",
    "3:00 PM TO 4:30 PM",
  ];

  const venueOptions = [
    "AIML LAB 1",
    "AIML LAB 2",
    "AIML LAB 3",
    "AIML LAB 4",
    "AIML LAB 5",
    "IT LAB 1",
    "IT LAB 2",
    "IT LAB 3",
    "IT LAB 4",
    "IT LAB 5",
    "CSE LAB 1",
    "CSE LAB 2",
    "CSE LAB 3",
    "CSE LAB 4",
    "MECH CAD LAB",
    "MECH CT LAB",
  ];

  const style = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {
      xs: "90vw",
      sm: 400,
    },
    maxHeight: "80vh",
    overflowX: "hidden",
    bgcolor: "background.paper",
    border: "0px solid #000",
    boxShadow: 24,
    p: 3,
    borderRadius: "8px",
  };
  const deleteStyle = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    minWidth: "200px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "0px solid #000",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
  };

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_APP_URL}/api/courses/${Facultydept}`
        );
        setSubject(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    if (Facultydept) fetchCourses();
  }, [Facultydept]);

  // Fetch Experiments for selected subject
  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_APP_URL}/api/exp/${subject}`
        );
        setexpDB(response.data);
      } catch (error) {
        console.error("Failed to fetch experiments:", error);
      } finally {
        setloading(false);
      }
    };
    if (subject) {
      setloading(true);
      fetchExperiments();
    }
  }, [subject]);

  // Fetch All Slots
  useEffect(() => {
    const fetchAllSlots = async () => {
      try {
        setSlotLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_APP_URL}/api/faculty/allSlots`,
          { FacultyEmail }
        );
        setallslots(response.data);
      } catch (error) {
        console.error("Failed to fetch slot details:", error);
      } finally {
        setSlotLoading(false);
      }
    };
    if (FacultyEmail) fetchAllSlots();
  }, [FacultyEmail]);

  const createSlot = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_APP_URL}/api/courses`, {
        Staff_name: Facultyname,
        email: FacultyEmail,
        Course: subject,
        dept: Facultydept,
        Date: date,
        Time: time,
        venue,
        capacity,
        pdf_material: materialLink,
        video_material: video,
        experiment: exp,
      });
      setOpen(false);
      setallslots((prev) => [...prev, response.data.slot]);

      // reset form
      setsubject("");
      setdate("");
      settime("");
      setvenue("");
      setcapacity("");
      setmaterial("");
      setvideo("");
      setexp({});
    } catch (error) {
      seterror(error.response?.data?.message || "Failed to create slot");
      console.error("Failed to create Slot:", error);
    }
  };

  const handleOpenDelete = (id) => {
    setSelectedSlotId(id);
    setPopupOpen(true);
  };

  const handleCloseDelete = () => {
    setPopupOpen(false);
    setSelectedSlotId(null);
  };

  const handleRemove = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_APP_URL}/api/faculty/allSlots/${selectedSlotId}`
      );
      setallslots((prev) =>
        prev.filter((slot) => slot._id !== selectedSlotId)
      );
      setPopupOpen(false);
      setSelectedSlotId(null);
    } catch (error) {
      console.log("Error deleting the slot:", error);
    }
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    const conflict = allslots.some(
      (slot) => slot.Date === date && slot.Time === time && slot.venue === venue
    );

    if (conflict) {
      seterror(
        "⚠️ Slot conflict: Another slot exists with the same date, time, and venue."
      );
      return;
    }
    createSlot();
  };

  // Filter + Sort
  const processedSlots = allslots
    .filter((slot) => {
      const slotDate = new Date(slot.Date).setHours(0, 0, 0, 0);
      const today = new Date().setHours(0, 0, 0, 0);

      const [filterPart] = filterSortOption.split("-");
      if (filterPart === "today") return slotDate === today;
      if (filterPart === "future") return slotDate > today;
      if (filterPart === "past") return slotDate < today;
      return true;
    })
    .sort((a, b) => {
      const [, sortPart] = filterSortOption.split("-");
      if (sortPart === "latest") return new Date(b.Date) - new Date(a.Date);
      if (sortPart === "earliest") return new Date(a.Date) - new Date(b.Date);
      return 0;
    });

  return (
    <div className="dashboard-container">
      <StaffAppBar />
      <h2
      style={{
        marginLeft:"18px"
      }}>Faculty Dashboard</h2>
      <p>Welcome back, Dr. {Facultyname}</p>

      <div className="dashboard-cards">
        <div className="card">
          <p>Total Slots</p>
          <h3>{allslots.length}</h3>
        </div>
        <div className="card">
          <p>Total Bookings</p>
          <h3>0</h3>
        </div>
        <div
          className="card filter-card"
          style={{ backgroundColor: "transparent", boxShadow: "none" }}
        >
          <label
            htmlFor="filter"
            style={{ fontWeight: "bold", color: "#475569" }}
          >
            Filter:
          </label>
          <select
            className="filter-select"
            value={filterSortOption}
            onChange={(e) => setFilterSortOption(e.target.value)}
          >
            <option value="all-latest">All - Latest First</option>
            <option value="all-earliest">All - Earliest First</option>
            <option value="future-latest">Future - Latest First</option>
            <option value="future-earliest">Future - Earliest First</option>
            <option value="past-latest">Past - Latest First</option>
            <option value="past-earliest">Past - Earliest First</option>
            <option value="today-latest">Today - Latest First</option>
            <option value="today-earliest">Today - Earliest First</option>
          </select>
        </div>
      </div>

      <button
        className="create-btn"
        onClick={() => {
          setOpen(true);
          seterror("");
        }}
      >
        + Create New Slot
      </button>

      {/* Loader */}
      {slotLoading ? (
        <div style={{ textAlign: "center", padding: "30px" }}>
          <span className="loader"></span>
          <p>Loading slots...</p>
        </div>
      ) : (
        <div className="slot-list">
          {processedSlots.map((slot) => (
            <div key={slot._id} className="slot-card">
              <div className="slot-header">
                <h3>
                  {slot.Course} - Exp.No: {slot.experiment.exp_no}
                  <span className="your-slot-badge">Your Slot</span>
                </h3>
              </div>

              <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <BookIcon fontSize="small" />
                {new Date(slot.Date).toDateString()}
              </p>

              <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <AccessTimeIcon fontSize="small" />
                {slot.Time}
              </p>

              <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <LocationOnIcon fontSize="small" />
                {slot.venue}
              </p>

              <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <GroupIcon fontSize="small" />
                {slot.total_booked}/{slot.capacity} Capacity
              </p>

              <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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

              <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
                className="remove-btn-bottom-right"
                title="Remove Slot"
                onClick={() => handleOpenDelete(slot._id)}
                style={{ backgroundColor: "red" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Slot Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <form onSubmit={handleConfirm}>
            <div className="popup">
              <h2>Create Slot</h2>
              <label>
                Subject:
                <select
                  value={subject}
                  onChange={(e) => {
                    setsubject(e.target.value);
                    seterror("");
                  }}
                  required
                >
                  <option value="" disabled>
                    -- Select Course --
                  </option>
                  {subjectOptions.map((s, i) => (
                    <option key={i}>{s}</option>
                  ))}
                </select>
              </label>

              <label>
                Experiment:
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const selectedExp = JSON.parse(e.target.value);
                    setexp(selectedExp);
                  }}
                  required
                >
                  <option value="" disabled>
                    -- Select Experiment --
                  </option>
                  {expDB.map((ex, i) => (
                    <option
                      key={i}
                      value={JSON.stringify({
                        exp_no: ex.exp_no,
                        exp_name: ex.exp_name,
                        exp_description: ex.exp_description,
                      })}
                    >
                      {ex.exp_no} - {ex.exp_name} - {ex.exp_description}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Date:
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  onChange={(e) => {
                    setdate(e.target.value);
                    seterror("");
                  }}
                />
              </label>

              <label>
                Time:
                <select
                  value={time}
                  onChange={(e) => {
                    settime(e.target.value);
                    seterror("");
                  }}
                  required
                >
                  <option value="" disabled>
                    -- Select Time --
                  </option>
                  {timeSlots.map((t, i) => (
                    <option key={i}>{t}</option>
                  ))}
                </select>
              </label>

              <label>
                Venue:
                <select
                  value={venue}
                  onChange={(e) => {
                    setvenue(e.target.value);
                    seterror("");
                  }}
                  required
                >
                  <option value="" disabled>
                    -- Select Venue --
                  </option>
                  {venueOptions.map((v, i) => (
                    <option key={i}>{v}</option>
                  ))}
                </select>
              </label>

              <label>
                Capacity:
                <input
                  type="number"
                  min="1"
                  max="70"
                  value={capacity}
                  required
                  onChange={(e) => setcapacity(e.target.value)}
                />
              </label>

              <label>
                PDF Material Link:
                <input
                  type="text"
                  value={materialLink}
                  onChange={(e) => setmaterial(e.target.value)}
                  required
                />
              </label>

              <label>
                Video Material Link:
                <input
                  type="text"
                  value={video}
                  onChange={(e) => setvideo(e.target.value)}
                  required
                />
              </label>

              {error && (
                <div
                  style={{
                    backgroundColor: "#ffe5e5",
                    padding: "8px",
                    borderRadius: "4px",
                    color: "red",
                    marginBottom: "10px",
                  }}
                >
                  ❌ {error}
                </div>
              )}

              <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                <button type="submit">Confirm</button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    seterror("");
                  }}
                  style={{ backgroundColor: "#ccc", color: "#333" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={popupOpen} onClose={handleCloseDelete}>
        <Box sx={deleteStyle}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            sx={{ textAlign: "center" }}
          >
            <ErrorOutlineIcon sx={{ color: "red", position: "relative" }} /> Are
            You Sure?
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Deleting this slot leads to loss of all the data related to this
            slot.
          </Typography>
          <div className="popup-buttons">
            <button className="confirm" onClick={handleRemove}>
              Confirm
            </button>
            <button className="cancel" onClick={handleCloseDelete}>
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default SlotList;
