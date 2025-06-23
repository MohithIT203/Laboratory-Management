import React, { useEffect, useState, useRef } from "react";
import "./student-landing.css";
import {
  FaBookOpen,
  FaClipboardList,
  FaClock,
  FaCalendarAlt,
  FaFilter,
  FaCheckCircle,
} from "react-icons/fa";

const CourseList = () => {
  const [slots, setSlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [activeTab, setActiveTab] = useState("available");

  // Booking and rejecting states
  const [bookingSlot, setBookingSlot] = useState(null);
  const [rejectingSlot, setRejectingSlot] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Refs for detecting outside click on popups
  const bookingRef = useRef(null);
  const rejectRef = useRef(null);

  useEffect(() => {
    const savedSlots = localStorage.getItem("createdSlots");
    if (savedSlots) {
      setSlots(JSON.parse(savedSlots));
    }
  }, []);

  // Update slots in state and localStorage
  const updateSlots = (updatedSlots) => {
    setSlots(updatedSlots);
    localStorage.setItem("createdSlots", JSON.stringify(updatedSlots));
  };

  // Close popup if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        bookingSlot &&
        bookingRef.current &&
        !bookingRef.current.contains(event.target)
      ) {
        setBookingSlot(null);
      }
      if (
        rejectingSlot &&
        rejectRef.current &&
        !rejectRef.current.contains(event.target)
      ) {
        setRejectingSlot(null);
        setRejectReason("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [bookingSlot, rejectingSlot]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isSameDate = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const filteredSlots = slots.filter((slot) => {
    const slotDate = new Date(slot.date);
    slotDate.setHours(0, 0, 0, 0);

    const dateMatch = dateFilter
      ? isSameDate(slotDate, new Date(dateFilter))
      : true;

    const searchMatch = searchTerm
      ? slot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.venue.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const isUpcoming = slotDate >= today;

    return dateMatch && searchMatch && isUpcoming && slot.enrolled === 0;
  });

  const myBookings = slots.filter((slot) => slot.enrolled > 0);
  const myBookingsCount = myBookings.length;

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    if (!bookingSlot) return;

    // Mark the slot as booked by setting enrolled = 1
    const updatedSlots = slots.map((slot) =>
      slot.id === bookingSlot.id ? { ...slot, enrolled: 1 } : slot
    );

    updateSlots(updatedSlots);
    setBookingSlot(null);
  };

  // Handle rejection confirmation
  const handleConfirmReject = () => {
    if (!rejectingSlot) return;
    if (!rejectReason.trim()) {
      alert("Please enter a reason for rejection.");
      return;
    }

    // Remove rejected slot from available slots
    const updatedSlots = slots.filter((slot) => slot.id !== rejectingSlot.id);

    updateSlots(updatedSlots);
    setRejectingSlot(null);
    setRejectReason("");
  };

  return (
    <div className="student-wrapper">
      <div className="student-course_content">
        <h3 className="student-section-title">SLOTS AVAILABLE</h3>

        <div className="student-carddiv">
          <div className="student-stucard">
            <div className="student-card-header">
              <p>My Bookings</p>
              <FaBookOpen size={24} color="#4caf50" />
            </div>
            <h3>{myBookingsCount}</h3>
          </div>

          <div className="student-stucard">
            <div className="student-card-header">
              <p>Total Bookings</p>
              <FaClipboardList size={24} color="#2196f3" />
            </div>
            <h3>
              {slots.reduce((sum, slot) => sum + (slot.enrolled || 0), 0)}
            </h3>
          </div>

          <div className="student-stucard">
            <div className="student-card-header">
              <h3>Next Session</h3>
              <FaClock size={22} color="#f57c00" />
            </div>
            {myBookings.length > 0 ? (
              <>
                <h4 className="student-session-time">{myBookings[0].time}</h4>
                <h3>
                  {myBookings[0].title} – {myBookings[0].venue}
                </h3>
              </>
            ) : (
              <>
                <h4 className="student-session-time">No upcoming sessions</h4>
                <h3>Check back later</h3>
              </>
            )}
          </div>
        </div>

        <div className="student-tab-section">
          <div className="student-tabs">
            <div
              className={`student-tab ${
                activeTab === "available" ? "active" : ""
              }`}
              onClick={() => setActiveTab("available")}
            >
              Available Slots
            </div>
            <div
              className={`student-tab ${
                activeTab === "bookings" ? "active" : ""
              }`}
              onClick={() => setActiveTab("bookings")}
            >
              My Bookings ({myBookingsCount})
            </div>
          </div>

          <div className="student-filter-bar">
            <input
              type="text"
              placeholder="Search slots by title or lab name..."
              className="student-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="student-date-filter">
              <FaFilter color="#555" />
              <input
                type="date"
                className="student-date-text"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
              <FaCalendarAlt color="#555" />
            </div>
          </div>

          <div className="student-slot-container">
            {activeTab === "available" ? (
              filteredSlots.length > 0 ? (
                filteredSlots.map((slot) => (
                  <div key={slot.id} className="student-slot-card">
                    <h3>{slot.title}</h3>
                    <p>
                      <b>🗓️</b> {new Date(slot.date).toDateString()}
                    </p>
                    <p>
                      <b>⏰</b> {slot.time}
                    </p>
                    <p>
                      <b>📍</b> {slot.venue}
                    </p>
                    <p>
                      <b>👥</b> {slot.enrolled || 0}/{slot.capacity} Enrolled
                    </p>

                    {slot.pdfName && (
                      <div className="student-materials">
                        <b>📄 PDF:</b>{" "}
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

                    <div className="student-slot-actions">
                      <button
                        className="student-book-btn"
                        onClick={() => setBookingSlot(slot)}
                      >
                        Book Slot
                      </button>
                      <button
                        className="student-reject-btn"
                        onClick={() => setRejectingSlot(slot)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="student-no-slots">
                  <FaCalendarAlt size={60} color="#c0c0c0" />
                  <h4>No available slots</h4>
                  <p>Check back later for new lab sessions</p>
                </div>
              )
            ) : (
              <div className="student-bookings">
                {myBookingsCount > 0 ? (
                  myBookings.map((slot) => (
                    <div key={slot.id} className="student-booking-card">
                      <h3>{slot.title}</h3>
                      <p>
                        <b>🗓️</b> {new Date(slot.date).toDateString()}
                      </p>
                      <p>
                        <b>⏰</b> {slot.time}
                      </p>
                      <p>
                        <b>📍</b> {slot.venue}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          color: "#4caf50",
                          fontWeight: "600",
                          marginTop: "0.5rem",
                          fontSize: "1rem",
                        }}
                      >
                        <FaCheckCircle />
                        <span>Booked</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="student-no-bookings">
                    <FaBookOpen size={60} color="#c0c0c0" />
                    <h4>No bookings yet</h4>
                    <p>Book available slots to see them here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Confirmation Popup */}
      {bookingSlot && (
        <div className="popup-overlay">
          <div className="popup-content" ref={bookingRef}>
            <h3>Confirm Booking</h3>
            <p>
              Are you sure you want to book the slot for{" "}
              <b>{bookingSlot.title}</b> on{" "}
              <b>{new Date(bookingSlot.date).toDateString()}</b> at{" "}
              <b>{bookingSlot.time}</b>?
            </p>
            <div className="popup-buttons">
              <button onClick={handleConfirmBooking}>Confirm</button>
              <button
                onClick={() => setBookingSlot(null)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Popup */}
      {rejectingSlot && (
        <div className="popup-overlay">
          <div className="popup-content" ref={rejectRef}>
            <h3>Reject Slot</h3>
            <p>
              Please provide a reason for rejecting the slot{" "}
              <b>{rejectingSlot.title}</b> on{" "}
              <b>{new Date(rejectingSlot.date).toDateString()}</b> at{" "}
              <b>{rejectingSlot.time}</b>.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
            />
            <div className="popup-buttons">
              <button onClick={handleConfirmReject}>Submit</button>
              <button
                onClick={() => {
                  setRejectingSlot(null);
                  setRejectReason("");
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;
