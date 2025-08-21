import { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import profilePic from "./profile.jpeg"; // replace with your profile image path

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h2 className="logo">Lab Management</h2>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/update-slot" onClick={() => setMenuOpen(false)}>
            Update Slot
          </Link>
          <Link to="/update-subject" onClick={() => setMenuOpen(false)}>
            Update Subject
          </Link>
        </div>

        <div className="nav-actions">
          {/* Profile dropdown */}
          <div className="profile-container">
            <img
              src={profilePic}
              alt="Profile"
              className="profile-pic"
              onClick={() => setProfileOpen(!profileOpen)}
            />
            {profileOpen && (
              <div className="profile-dropdown">
                <Link to="/profile" onClick={() => setProfileOpen(false)}>
                  Profile
                </Link>
                <Link to="/" onClick={() => setProfileOpen(false)}>
                  Logout
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger menu */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
