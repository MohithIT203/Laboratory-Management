// pages/ViewSlots.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./viewSlot.css"; // updated file name

const ViewSlots = () => {
  const [slots, setSlots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("createdSlots");
    if (saved) setSlots(JSON.parse(saved));
  }, []);

  const handleSlotClick = (slot) => {
    navigate("/mark_attendance", { state: { slotTitle: slot.title } });
  };

  return (
    <div className="viewslots-container">
      <h2 className="viewslots-title">Select a Slot</h2>
      <div className="viewslots-grid">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="viewslots-card"
            onClick={() => handleSlotClick(slot)}
          >
            <h4>{slot.title}</h4>
            <p>📅 {new Date(slot.date).toDateString()}</p>
            <p>⏰ {slot.time}</p>
            <p>📍 {slot.venue}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewSlots;
