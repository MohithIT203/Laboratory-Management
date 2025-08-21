import React from "react";
import "./profile.css";

export default function Profile({ show, onClose, profile }) {
  if (!show) return null;

  return (
    <div className="profile-overlay">
      <div className="profile-box">
        {/* Profile Image */}
        <img
          src={profile.image || "https://via.placeholder.com/120"}
          alt="Profile"
          className="profile-pic"
        />

        {/* Info */}
        <h2>{profile.name}</h2>
        <p><strong>Roll No:</strong> {profile.rollno}</p>
        <p><strong>Department:</strong> {profile.department}</p>

        {/* Close button */}
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
