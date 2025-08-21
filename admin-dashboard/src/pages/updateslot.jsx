import React, { useState } from "react";
import "./updateslot.css";

function AllSlots() {
  const slotsData = [
    {
      os: "Windows 10",
      slotNo: 1,
      date: "Fri Aug 22 2025",
      time: "10:50 AM TO 12:30 PM",
      location: "MECH CAD LAB",
      img: "https://media.istockphoto.com/id/1294693719/vector/illustration-of-person-working-in-tidy-modern-office.webp?b=1&s=612x612&w=0&k=20&c=xvbdMGTJRuMGWMdpxMllz4CJI5vXU8XFMVb75eG1uYo=",
    },
    {
      os: "Ubuntu 22.04",
      slotNo: 2,
      date: "Sat Aug 23 2025",
      time: "9:00 AM TO 10:30 AM",
      location: "CSE LAB 1",
      img: "https://media.istockphoto.com/id/1294693719/vector/illustration-of-person-working-in-tidy-modern-office.webp?b=1&s=612x612&w=0&k=20&c=xvbdMGTJRuMGWMdpxMllz4CJI5vXU8XFMVb75eG1uYo=",
    },
    {
      os: "Windows 10",
      slotNo: 1,
      date: "Fri Aug 22 2025",
      time: "10:50 AM TO 12:30 PM",
      location: "MECH CAD LAB",
      img: "https://media.istockphoto.com/id/1294693719/vector/illustration-of-person-working-in-tidy-modern-office.webp?b=1&s=612x612&w=0&k=20&c=xvbdMGTJRuMGWMdpxMllz4CJI5vXU8XFMVb75eG1uYo=",
    },
    {
      os: "Ubuntu 22.04",
      slotNo: 2,
      date: "Sat Aug 23 2025",
      time: "9:00 AM TO 10:30 AM",
      location: "CSE LAB 1",
      img: "https://media.istockphoto.com/id/1294693719/vector/illustration-of-person-working-in-tidy-modern-office.webp?b=1&s=612x612&w=0&k=20&c=xvbdMGTJRuMGWMdpxMllz4CJI5vXU8XFMVb75eG1uYo=",
    },
    {
      os: "Windows 10",
      slotNo: 1,
      date: "Fri Aug 22 2025",
      time: "10:50 AM TO 12:30 PM",
      location: "MECH CAD LAB",
      img: "https://media.istockphoto.com/id/1294693719/vector/illustration-of-person-working-in-tidy-modern-office.webp?b=1&s=612x612&w=0&k=20&c=xvbdMGTJRuMGWMdpxMllz4CJI5vXU8XFMVb75eG1uYo=",
    },
    {
      os: "Ubuntu 22.04",
      slotNo: 2,
      date: "Sat Aug 23 2025",
      time: "9:00 AM TO 10:30 AM",
      location: "CSE LAB 1",
      img: "https://media.istockphoto.com/id/1294693719/vector/illustration-of-person-working-in-tidy-modern-office.webp?b=1&s=612x612&w=0&k=20&c=xvbdMGTJRuMGWMdpxMllz4CJI5vXU8XFMVb75eG1uYo=",
    },
    {
      os: "Windows 10",
      slotNo: 1,
      date: "Fri Aug 22 2025",
      time: "10:50 AM TO 12:30 PM",
      location: "MECH CAD LAB",
      img: "https://media.istockphoto.com/id/1294693719/vector/illustration-of-person-working-in-tidy-modern-office.webp?b=1&s=612x612&w=0&k=20&c=xvbdMGTJRuMGWMdpxMllz4CJI5vXU8XFMVb75eG1uYo=",
    },
    {
      os: "Ubuntu 22.04",
      slotNo: 2,
      date: "Sat Aug 23 2025",
      time: "9:00 AM TO 10:30 AM",
      location: "CSE LAB 1",
      img: "https://media.istockphoto.com/id/1294693719/vector/illustration-of-person-working-in-tidy-modern-office.webp?b=1&s=612x612&w=0&k=20&c=xvbdMGTJRuMGWMdpxMllz4CJI5vXU8XFMVb75eG1uYo=",
    }
  ];

  const [slots, setSlots] = useState(slotsData);
  const [displaySlots, setDisplaySlots] = useState(slotsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Popup state
  const [editingSlot, setEditingSlot] = useState(null);
  const [editForm, setEditForm] = useState({
    os: "",
    slotNo: "",
    date: "",
    time: "",
    location: "",
    img: "",
  });

  const handleSearch = () => {
    const filtered = slots.filter(
      (s) =>
        s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.slotNo.toString().includes(searchTerm)
    );
    setDisplaySlots(filtered);
  };

  const handleDateFilter = () => {
    if (!selectedDate) return;
    const dateObj = new Date(selectedDate);
    const filtered = slots.filter((s) => {
      const slotDate = new Date(s.date);
      return (
        slotDate.getFullYear() === dateObj.getFullYear() &&
        slotDate.getMonth() === dateObj.getMonth() &&
        slotDate.getDate() === dateObj.getDate()
      );
    });
    setDisplaySlots(filtered);
  };

  const openEditPopup = (slot, index) => {
    setEditingSlot(index);
    setEditForm(slot);
  };

  const closePopup = () => {
    setEditingSlot(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const saveChanges = () => {
    const updatedSlots = [...slots];
    updatedSlots[editingSlot] = editForm;
    setSlots(updatedSlots);
    setDisplaySlots(updatedSlots);
    closePopup();
  };

  return (
    <div>
      <div className="controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Location or Slot No"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="date-filter-container">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button onClick={handleDateFilter}>Filter by Date</button>
        </div>
      </div>

      <div className="slot-cards">
        {displaySlots.map((slot, index) => (
          <div key={index} className="slot">
            <img
              src={slot.img}
              style={{
                height: "200px",
                width: "100%",
                maxWidth: "300px",
                objectFit: "cover",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem",
              }}
              alt="Slot"
            />
            <div className="slot-info">
              <p>
                <strong>Slot No:</strong> {slot.slotNo}
              </p>
              <p>
                <strong>Date:</strong> {slot.date}
              </p>
              <p>
                <strong>Time:</strong> {slot.time}
              </p>
              <p>
                <strong>{slot.location}</strong>
              </p>
              <button
                className="view-btn"
                onClick={() => openEditPopup(slot, index)}
              >
                Edit Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Popup */}
      {editingSlot !== null && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">Edit Slot</div>
            <div className="popup-content">
              <label>OS:</label>
              <input
                type="text"
                name="os"
                value={editForm.os}
                onChange={handleEditChange}
              />
              <label>Slot No:</label>
              <input
                type="number"
                name="slotNo"
                value={editForm.slotNo}
                onChange={handleEditChange}
              />
              <label>Date:</label>
              <input
                type="text"
                name="date"
                value={editForm.date}
                onChange={handleEditChange}
              />
              <label>Time:</label>
              <input
                type="text"
                name="time"
                value={editForm.time}
                onChange={handleEditChange}
              />
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={editForm.location}
                onChange={handleEditChange}
              />
              <label>Image URL:</label>
              <input
                type="text"
                name="img"
                value={editForm.img}
                onChange={handleEditChange}
              />
            </div>
            <div className="popup-actions">
              <button onClick={saveChanges} className="save-btn">
                Save
              </button>
              <button onClick={closePopup} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllSlots;