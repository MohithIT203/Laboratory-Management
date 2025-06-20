import React, { useState, useEffect } from "react";
import "./teacher-landing.css";

const SlotList = () => {
  const [slots, setSlots] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [weekDates, setWeekDates] = useState([]);
  const [filter, setFilter] = useState("All Slots");

  const [newSlot, setNewSlot] = useState({
    title: "",
    date: "",
    time: "8:45 AM TO 10:30 AM",
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
            <option>All Slots</option>
          </select>
        </div>
      </div>

      <button className="create-btn" onClick={() => setShowPopup(true)}>
        + Create New Slot
      </button>

      <div className="slot-list">
        {slots.map((slot) => (
          <div key={slot.id} className="slot-card">
            <div className="slot-header">
              <h3>
                {slot.title} <span className="your-slot-badge">Your Slot</span>
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
              style={{ backgroundColor: "red" }}
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
            Subject:
            <select
              value={newSlot.title}
              onChange={(e) =>
                setNewSlot({ ...newSlot, title: e.target.value })
              }
            >
              {subjectOptions.map((s, i) => (
                <option key={i}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Date:
            <input
              type="date"
              style={{ width: "482px" }}
              value={newSlot.date}
              onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
            />
          </label>
          <label>
            Time:
            <select
              value={newSlot.time}
              onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
            >
              {timeSlots.map((t, i) => (
                <option key={i}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Venue:
            <select
              value={newSlot.venue}
              onChange={(e) =>
                setNewSlot({ ...newSlot, venue: e.target.value })
              }
            >
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
              value={newSlot.capacity}
              onChange={(e) =>
                setNewSlot({ ...newSlot, capacity: parseInt(e.target.value) })
              }
            />
          </label>
          <label>
            Upload PDF Material:
            <input type="file" accept=".pdf" onChange={handleFileUpload} />
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
