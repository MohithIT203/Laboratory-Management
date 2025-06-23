import React, { useState, useEffect } from "react";
import "./teacher-landing.css";

const SlotList = () => {
  const [slots, setSlots] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [filter, setFilter] = useState("All Slots");

  const [newSlot, setNewSlot] = useState({
    title: "",
    date: "",
    time: "",
    venue: "AIML LAB 1",
    capacity: 20,
    pdfName: "",
    pdfData: "",
  });

  const subjectOptions = [
    "DATA STRUCTURES II",
    "DATABASE MANAGEMENT SYSTEM",
    "WEB TECHNOLOGY AND FRAMEWORKS",
    "INTERNET OF THINGS",
  ];

  const timeSlots = [
    "8:45 AM TO 10:30 AM",
    "10:50 AM TO 12:30 PM",
    "1:30 PM TO 3:00 PM",
    "3:00 PM TO 4:30 PM",
  ];

  const venueOptions = [
    "AIML LAB 1",
    "AIML LAB 2",
    "IT LAB 1",
    "IT LAB 2",
    "MECH CAD LAB",
    "MECH CT LAB",
  ];

  useEffect(() => {
    const savedSlots = localStorage.getItem("createdSlots");
    if (savedSlots) {
      setSlots(JSON.parse(savedSlots));
    }
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        setNewSlot((prev) => ({
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
    const { title, date, time, venue, capacity, pdfData } = newSlot;
    if (!title || !date || !time || !venue || !capacity || !pdfData) {
      alert("Please fill in all required fields and upload a PDF.");
      return;
    }

    // Duplicate check
    const isDuplicate = slots.some(
      (slot) => slot.date === date && slot.time === time && slot.venue === venue
    );

    if (isDuplicate) {
      alert("A slot already exists for the selected venue, date, and time.");
      return;
    }

    const id = slots.length + 1;
    const newEntry = {
      id,
      ...newSlot,
      enrolled: 0,
    };
    const updatedSlots = [...slots, newEntry];
    setSlots(updatedSlots);
    localStorage.setItem("createdSlots", JSON.stringify(updatedSlots));
    setShowPopup(false);
  };

  const handleRemove = (id) => {
    const updatedSlots = slots.filter((slot) => slot.id !== id);
    setSlots(updatedSlots);
    localStorage.setItem("createdSlots", JSON.stringify(updatedSlots));
  };

  const getAvailableTimeSlots = () => {
    return timeSlots.filter((time) => {
      return !slots.some(
        (slot) =>
          slot.date === newSlot.date &&
          slot.venue === newSlot.venue &&
          slot.time === time
      );
    });
  };

  const totalBookings = slots.reduce(
    (sum, slot) => sum + (slot.enrolled || 0),
    0
  );

  return (
    <div className="dashboard-container">
      <h2>Faculty Dashboard</h2>
      <p>Welcome back, Dr. Sarah Johnson</p>
      <div className="dashboard-cards">
        <div className="card">
          <p>Total Slots</p>
          <h3>{slots.length}</h3>
        </div>
        <div className="card">
          <p>Total Bookings</p>
          <h3>{totalBookings}</h3>
        </div>
        <div
          className="card filter-card"
          style={{ backgroundColor: "transparent", boxShadow: "none" }}
        >
          <label
            htmlFor="filter"
            style={{ fontWeight: "bold", color: "#212020" }}
          >
            Filter:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All Slots">All Slots</option>
            {subjectOptions.map((subject, i) => (
              <option key={i} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button className="create-btn" onClick={() => setShowPopup(true)}>
        + Create New Slot
      </button>

      <div className="slot-list">
        {slots
          .filter((slot) => filter === "All Slots" || slot.title === filter)
          .map((slot) => (
            <div key={slot.id} className="slot-card">
              <div className="slot-header">
                <h3>
                  {slot.title}{" "}
                  <span className="your-slot-badge">Your Slot</span>
                </h3>
              </div>
              <p>
                <b>📅</b> {new Date(slot.date).toDateString()}
              </p>
              <p>
                <b>⏰</b> {slot.time}
              </p>
              <p>
                <b>📍</b> {slot.venue}
              </p>
              <p>
                <b>👥</b> 0/{slot.capacity} Capacity
              </p>
              {slot.pdfData && (
                <div className="materials">
                  <b>📄 PDF Material:</b>{" "}
                  <a
                    href={slot.pdfData}
                    download={slot.pdfName}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {slot.pdfName}
                  </a>
                </div>
              )}
              <button
                className="remove-btn bottom-right"
                title="Remove Slot"
                onClick={() => handleRemove(slot.id)}
                style={{
                  backgroundColor: "#e53e3e", // bright red
                  marginTop: "20px",
                  height: "36px",
                  width: "120px", // wider so text fits nicely
                  borderRadius: "8px",
                  border: "none",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 8px rgba(229, 62, 62, 0.4)",
                  transition: "background-color 0.3s ease",
                  userSelect: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#c53030")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e53e3e")
                }
              >
                Delete
              </button>
            </div>
          ))}
      </div>

      {showPopup && (
        <div className="popup">
          <h3>Create Slot</h3>

          <label>
            Subject<span style={{ color: "red" }}>*</span>:
            <select
              value={newSlot.title}
              onChange={(e) =>
                setNewSlot({ ...newSlot, title: e.target.value })
              }
              required
            >
              <option value="">-- Select Subject --</option>
              {subjectOptions.map((s, i) => (
                <option key={i}>{s}</option>
              ))}
            </select>
          </label>

          <label>
            Date<span style={{ color: "red" }}>*</span>:
            <input
              type="date"
              value={newSlot.date}
              onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
              required
            />
          </label>

          <label>
            Time<span style={{ color: "red" }}>*</span>:
            <select
              value={newSlot.time}
              onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
              required
            >
              <option value="">-- Select Time Slot --</option>
              {getAvailableTimeSlots().map((t, i) => (
                <option key={i}>{t}</option>
              ))}
            </select>
            {getAvailableTimeSlots().length === 0 && (
              <p style={{ color: "red", fontSize: "0.9rem" }}>
                No available slots for this lab and date.
              </p>
            )}
          </label>

          <label>
            Venue<span style={{ color: "red" }}>*</span>:
            <select
              value={newSlot.venue}
              onChange={(e) =>
                setNewSlot({ ...newSlot, venue: e.target.value })
              }
              required
            >
              {venueOptions.map((v, i) => (
                <option key={i}>{v}</option>
              ))}
            </select>
          </label>

          <label>
            Capacity<span style={{ color: "red" }}>*</span>:
            <input
              type="number"
              min="1"
              value={newSlot.capacity}
              onChange={(e) =>
                setNewSlot({ ...newSlot, capacity: parseInt(e.target.value) })
              }
              required
            />
          </label>

          <label>
            Upload PDF Material<span style={{ color: "red" }}>*</span>:
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              required
            />
            {newSlot.pdfName && (
              <p style={{ fontSize: "0.9rem" }}>Selected: {newSlot.pdfName}</p>
            )}
          </label>

          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <button onClick={handleConfirm}>Confirm</button>
            <button
              onClick={() => setShowPopup(false)}
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
      )}
    </div>
  );
};

export default SlotList;
