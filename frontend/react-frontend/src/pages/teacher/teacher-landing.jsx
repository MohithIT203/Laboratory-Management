import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useLocation } from "react-router-dom";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import "./teacher-landing.css";
import axios from "axios";

const SlotList = () => {
  const location = useLocation();
  const { Facultyname, Facultydept, FacultyEmail } = location.state || {};

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
  const [materialLink, setmaterial] = useState([]);
  const[video,setvideo]=useState([]);
  const[error,seterror]=useState("");
  const timeSlots = [
    "8:45 AM TO 10:30 AM",
    "10:50 AM TO 12:30 PM",
    "1:30 PM TO 3:00 PM",
    "3:00 PM TO 4:30 PM",
  ];

  const venueOptions = [
    "AIML LAB 1", "AIML LAB 2", "AIML LAB 3", "AIML LAB 4", "AIML LAB 5",
    "IT LAB 1", "IT LAB 2", "IT LAB 3", "IT LAB 4", "IT LAB 5",
    "CSE LAB 1", "CSE LAB 2", "CSE LAB 3", "CSE LAB 4",
    "MECH CAD LAB", "MECH CT LAB",
  ];

  const style = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {
      xs: '90vw',
      sm: 400
    },
    height: {
      xs: '50vh',
      sm: 595
    },
    maxHeight: "90vh",
    // overflowY: "hidden",
    overflowX: "hidden",
    bgcolor: "background.paper",
    border: "0px solid #000",
    boxShadow: 24,
    p: 3,
    borderRadius: "8px",
  };
  const deleteStyle = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '200px',
    top: '50%',
    left: '50%',
    width: { sm: 100, xl: 400 },
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '0px solid #000',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
  };
  function CourseMethod(){
  // useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/courses/${Facultydept}`);
        setSubject(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    if (Facultydept) fetchCourses();
  // }, [Facultydept]);
  }
  const createSlot = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/api/courses`, {
        Staff_name: Facultyname,
        email: FacultyEmail,
        Course: subject,
        dept: Facultydept,
        Date: date,
        Time: time,
        venue,
        capacity,
        pdf_material:materialLink,
        video_material:video
      });
      setOpen(false);
      setallslots((prev) => [...prev, response.data.slot]);
    } catch (error) {
      
      seterror(error.response.data.message);
      // console.log(error.response.data.message);
      console.error("Failed to create Slot:", error);
    }
  };

  useEffect(() => {
    const fetchAllSlots = async () => {
      try {
        const response = await axios.post(`http://localhost:4000/api/faculty/allSlots`, {
          FacultyEmail,
        });
        setallslots(response.data);
      } catch (error) {
        console.error("Failed to fetch slot details:", error);
      }
    };
    if (FacultyEmail) fetchAllSlots();
  }, [FacultyEmail]);

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
      await axios.delete(`http://localhost:4000/api/faculty/allSlots/${selectedSlotId}`);
      setallslots((prev) => prev.filter(slot => slot._id !== selectedSlotId));
      setPopupOpen(false);
      setSelectedSlotId(null);
    } catch (error) {
      console.log("Error deleting the slot:", error);
    }
  };
  const handleConfirm = (e) => {
    e.preventDefault();
     const conflict = allslots.some(slot =>
    slot.Date === date &&
    slot.Time === time &&
    slot.venue === venue
  );

  if (conflict) {
    alert("⚠️ Slot conflict: Another slot exists with the same date, time, and venue.");
    return;
  }
    createSlot();
    
  };
  const [filterSortOption, setFilterSortOption] = useState("all-latest");

  const processedSlots = allslots
    .filter((slot) => {
      const date = new Date(slot.Date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [filterPart] = filterSortOption.split("-");
      if (filterPart === "today") return date.toDateString() === today.toDateString();
      if (filterPart === "future") return date > today;
      if (filterPart === "past") return date < today;
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
      <h2>Faculty Dashboard</h2>
      <p>Welcome back, Dr.{Facultyname}</p>
      
      <div className="dashboard-cards">
        <div className="card">
          <p>Total Slots</p>
          <h3>{allslots.length}</h3>
        </div>
        <div className="card">
          <p>Total Bookings</p>
          <h3>0</h3>
        </div>
        <div className="card filter-card" style={{ backgroundColor: "transparent", boxShadow: "none" }}>
          <label htmlFor="filter" style={{ fontWeight: "bold", color: "#475569" }}>Filter:</label>
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

      <button className="create-btn" onClick={() => {setOpen(true); seterror("");}}>
        + Create New Slot
      </button>

      <div className="slot-list">
        {processedSlots.map((slot) => (
          <div key={slot._id} className="slot-card">
            <div className="slot-header">
              <h3>{slot.Course} <span className="your-slot-badge">Your Slot</span></h3>
            </div>
            <p><b>📅</b> {new Date(slot.Date).toDateString()}</p>
            <p><b>⏰</b> {slot.Time}</p>
            <p><b>📍</b> {slot.venue}</p>
            <p><b>👥</b> 0/{slot.capacity} Capacity</p>
            {/* {slot.pdf_material && */}
            <p><b>📑 </b><a href={slot.pdf_material} target="_blank" style={{textDecoration:"none"}}>Pdf Material</a></p>
            {/* } */}
            {/* {slot.video_material && */}
            <p><b>📓 </b><a href={slot.video_material} target="_blank"style={{textDecoration:"none"}}>Video Material</a></p>

            <button className="remove-btn-bottom-right" title="Remove Slot" onClick={() => handleOpenDelete(slot._id)} style={{ backgroundColor: "red" }}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Create Slot Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <form onSubmit={handleConfirm}>
          {/* <form> */}
            <div className="popup">
              <h2 style={{ marginTop: "-5px" }}>Create Slot</h2>
              <label>
                Subject:
                <select value={subject} onChange={(e) => {setsubject(e.target.value);seterror("");}} onClick={CourseMethod}required>
                  <option value="" disabled>-- Select Course --</option>
                  {subjectOptions.map((s, i) => <option key={i}>{s}</option>)}
                </select>
              </label>
              <label>
                Date:
                <input type="date" value={date}
                  min={new Date().toISOString().split("T")[0]}
                  required onChange={(e) => {setdate(e.target.value);seterror("");}} />
              </label>
              <label>
                Time:
                <select value={time} onChange={(e) => {settime(e.target.value);seterror("");}} required>
                  <option value="" disabled>-- Select Time --</option>
                  {timeSlots.map((t, i) => <option key={i}>{t}</option>)}
                </select>
              </label>
              <label>
                Venue:
                <select value={venue} onChange={(e) => {setvenue(e.target.value);seterror("");}} required>
                  <option value="" disabled>-- Select Venue --</option>
                  {venueOptions.map((v, i) => <option key={i}>{v}</option>)}
                </select>
              </label>
              <label>
                Capacity:
                <input type="number" min="1" max="70" value={capacity} required onChange={(e) => setcapacity(e.target.value)} />
              </label>
              <label>
                PDF Material Link:
                <input type="text" onChange={(e)=> setmaterial(e.target.value) }required></input>
              </label>
              <label>
                Video Material Link:
                <input type="text" onChange={(e)=> setvideo(e.target.value)} required></input>
              </label>
                {error && (
  <div style={{ backgroundColor: "#ffe5e5", padding: "8px", borderRadius: "4px", color: "red", marginBottom: "10px" }}>
    ❌ {error}
  </div>
)}
              <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                {/* <button type="button" onClick={handleConfirm}>Confirm</button> */}
                <button type="submit">Confirm</button>
                <button type="button" onClick={() => {setOpen(false); seterror("");}} style={{ backgroundColor: "#ccc", color: "#333" }}>
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
          <Typography id="modal-modal-title" variant="h6" sx={{ textAlign: "center" }}>
            <ErrorOutlineIcon sx={{ color: "red", position: 'relative', top: "5px", right: '10px' }} />Are You Sure?
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Deleting this slot leads to loss of all the data related to this slot.
          </Typography>
          <div className="popup-buttons">
            <button className="confirm" onClick={handleRemove}>Confirm</button>
            <button className="cancel" onClick={handleCloseDelete}>Cancel</button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default SlotList;
