// AllSlots.jsx
import React, { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./updateslot.css";

function AllSlots() {
  const slotsData = [
    {
      id: 1,
      course: "Software Defined Networks",
      os: "Exp.No : 1",
      date: "2025-09-25",
      time: "10:50 AM TO 12:30 PM",
      totalStudents: 1,
      location: "CSE LAB 1",
      img: "https://media.istockphoto.com/id/1294693719/vector/illustration-of-person-working-in-tidy-modern-office.webp",
    },
    {
      id: 2,
      course: "Cloud Computing",
      os: "Exp.No : 2",
      date: "2025-09-26",
      time: "10:50 AM TO 12:30 PM",
      totalStudents: 1,
      location: "CSE LAB 2",
      img: "https://media.istockphoto.com/id/1294693719/vector/illustration-of-person-working-in-tidy-modern-office.webp",
    },
    {
      id: 3,
      course: "IoT Systems",
      os: "Exp.No : 3",
      date: "2025-09-27",
      time: "10:50 AM TO 12:30 PM",
      totalStudents: 1,
      location: "ECE LAB 3",
      img: "https://media.istockphoto.com/id/1294693719/vector/illustration-of-person-working-in-tidy-modern-office.webp",
    },
  ];

  const [slots, setSlots] = useState(slotsData);
  const [displaySlots, setDisplaySlots] = useState(slotsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [editingSlotIndex, setEditingSlotIndex] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const styleModal = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90vw", sm: 500 },
    maxHeight: "80vh",
    overflowY: "auto",
    bgcolor: "background.paper",
    border: "0px solid #000",
    boxShadow: 24,
    p: 3,
    borderRadius: "8px",
  };

  // 🔎 Search + Date Filter Combined
  useEffect(() => {
    let filtered = [...slots];

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (s) =>
          s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.os.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDate) {
      const dateObj = new Date(selectedDate);
      filtered = filtered.filter((s) => {
        const slotDate = new Date(s.date);
        return (
          slotDate.getFullYear() === dateObj.getFullYear() &&
          slotDate.getMonth() === dateObj.getMonth() &&
          slotDate.getDate() === dateObj.getDate()
        );
      });
    }

    setDisplaySlots(filtered);
  }, [searchTerm, selectedDate, slots]);

  // Edit Slot Modal
  const openEditModal = (slot, index) => {
    setEditingSlotIndex(index);
    setEditForm(slot);
    setOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const saveChanges = () => {
    const updatedSlots = [...slots];
    updatedSlots[editingSlotIndex] = editForm;
    setSlots(updatedSlots);
    setOpen(false);
  };

  return (
    <div>
      {/* Search & Date Filter */}
      <div className="controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Course, Location, or Exp.No"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="date-filter-container">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="slot-cards">
        {displaySlots.length > 0 ? (
          displaySlots.map((slot, index) => (
            <div key={slot.id} className="slot">
              <img src={slot.img} alt="Slot" />
              <div className="slot-info">
                <p><strong>Course:</strong> {slot.course}</p>
                <p><strong>{slot.os}</strong></p>
                <p><strong>Date:</strong> {slot.date}</p>
                <p><strong>Time:</strong> {slot.time}</p>
                <p><strong>Total Students:</strong> {slot.totalStudents}</p>
                <p><strong>Location:</strong> {slot.location}</p>
                <div className="action-buttons">
                  <button
                    className="view-btn"
                    onClick={() => openEditModal(slot, index)}
                  >
                    Edit Details
                  </button>
                  <button
                    className="attendance-btn"
                    onClick={() => navigate(`/attendance/${slot.id}`)}
                  >
                    View Attendance
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>No slots found</p>
        )}
      </div>

      {/* MUI Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={styleModal}>
          <h2>Edit Slot</h2>
          <label>
            Course:
            <input type="text" name="course" value={editForm.course || ""} onChange={handleEditChange} />
          </label>
          <label>
            Exp No:
            <input type="text" name="os" value={editForm.os || ""} onChange={handleEditChange} />
          </label>
          <label>
            Date:
            <input type="text" name="date" value={editForm.date || ""} onChange={handleEditChange} />
          </label>
          <label>
            Time:
            <input type="text" name="time" value={editForm.time || ""} onChange={handleEditChange} />
          </label>
          <label>
            Total Students:
            <input type="number" name="totalStudents" value={editForm.totalStudents || ""} onChange={handleEditChange} />
          </label>
          <label>
            Location:
            <input type="text" name="location" value={editForm.location || ""} onChange={handleEditChange} />
          </label>
          <label>
            Image URL:
            <input type="text" name="img" value={editForm.img || ""} onChange={handleEditChange} />
          </label>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <button onClick={saveChanges} style={{ width: "100px", height: "40px", backgroundColor: "#10b981", color: "white", borderRadius: "5px" }}>Save</button>
            <button onClick={() => setOpen(false)} style={{ width: "100px", height: "40px", backgroundColor: "#ccc", color: "#333", borderRadius: "5px" }}>Cancel</button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default AllSlots;
