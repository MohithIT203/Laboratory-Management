import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useLocation } from "react-router-dom";
import "./teacher-landing.css";
import axios from "axios";

const SlotList = () => {
  const location = useLocation();
  const [slots, setSlots] = useState([]);
  const [open, setOpen] = useState(false);
  const { Facultyname, Facultydept,FacultyEmail } = location.state || {};
  const [subjectOptions, setSubject] = useState([]);

  const [subject,setsubject]=useState("");
  const [date,setdate]=useState("");
  const [time,settime]=useState("");
  const [venue,setvenue]=useState(""); 
  const [capacity,setcapacity]=useState("");
  
  const [allslots,setallslots]=useState([]);
  
  const [pdf, setpdf] = useState({
    pdfName: "",
    pdfData: "",
  });

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
  overflowX:"hidden",
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  p: 3,
  borderRadius: "8px",
};


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/courses/${Facultydept}`
        );
        setSubject(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    
    if (Facultydept) fetchCourses();
  }, [Facultydept]);

 const fetchslotdata = async () => {
  try {
    const response = await axios.post(
      `http://localhost:4000/api/courses`,
      {
        Staff_name: Facultyname,
        email: FacultyEmail,
        Course: subject,
        dept: Facultydept,
        Date: date,
        Time: time,
        venue,
        capacity,
      }
    );
    setallslots((prev) => [...prev, response.data.slot]); 
  } catch (error) {
    console.error("Failed to create Slot:", error);
  }
};
   
useEffect(() => {
    const fetchAllSlots = async () => {
      try {
        const response = await axios.post(`http://localhost:4000/api/faculty/allSlots`, {
          FacultyEmail
        });
        setallslots(response.data);
      } catch (error) {
        console.error("Failed to fetch slot details:", error);
      }
    };
    if (FacultyEmail) fetchAllSlots();
  }, [FacultyEmail]);



  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        setpdf((prev) => ({
          ...prev,
          pdfData: reader.result,
          pdfName: file.name,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Only PDF files are allowed.");
    }
  };

  const handleConfirm = () => {
    fetchslotdata();
    setOpen(false);
  };

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
        <div
          className="card filter-card"
          style={{ backgroundColor: "transparent", boxShadow: "none" }}
        >
          <label htmlFor="filter" style={{ fontWeight: "bold", color: "#475569" }}>
            Filter:
          </label>
          <select className="filter-select">
            <option>All Slots</option>
          </select>
        </div>
      </div>

      <button className="create-btn" onClick={() => setOpen(true)}>
        + Create New Slot
      </button>

      <div className="slot-list">
        {allslots.map((slot) => (
          <div key={slot.id} className="slot-card">
            <div className="slot-header">
              <h3>
                {slot.Course} <span className="your-slot-badge">Your Slot</span>
              </h3>
            </div>
            <p><b>📅</b> {new Date(slot.Date).toDateString()}</p>
            <p><b>⏰</b> {slot.Time}</p>
            <p><b>📍</b> {slot.venue}</p>
            <p><b>👥</b> 0/{slot.capacity} Capacity</p>
            {pdf.pdfData && (
              <div className="materials">
                <b>📄 PDF Material:</b>{" "}
                <a
                  href={pdf.pdfData}
                  download={pdf.pdfName}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pdf.pdfName}
                </a>
              </div>
            )}
            <button
              className="remove-btn bottom-right"
              title="Remove Slot"
              // onClick={() => handleRemove(slot.id)}
              style={{ backgroundColor: "red" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} >
          <form onSubmit={handleConfirm}>
          <div className="popup" style={{}}>
            <h2 style={{marginTop:"0px"}}>Create Slot</h2>
            {/* <form action="/faculty/newSlot" method="post" enctype="multipart/form-data"> */}
            <label>
              Subject:
              
              <select
                value={subject}
                onChange={(e) => setsubject( e.target.value)}
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
              Date:
              <input
                type="date"
                style={{ width: "100%" }}
                value={date}
                 required
                onChange={(e) => setdate(e.target.value )}
              />
            </label>
            <label>
              Time:
             
              <select
              required
                value={time}
                onChange={(e) => settime(e.target.value )}
                 
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
                 required
                onChange={(e) => setvenue(e.target.value)}
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
                onChange={(e) =>
                  setcapacity(e.target.value)
                }
              />
            </label>
            <label>
              Upload PDF Material:
              <input type="file" accept=".pdf" onChange={handleFileUpload} />
              {pdf.pdfName && (
                <p style={{ fontSize: "0.9rem" }}>Selected: {pdf.pdfName}</p>
              )}
            </label>
            <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
              <button type="submit">Confirm</button>
              <button
                onClick={() => setOpen(false)}
                style={{
                  backgroundColor: "#ccc",
                  color: "#333",
                  border: "none",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default SlotList;
