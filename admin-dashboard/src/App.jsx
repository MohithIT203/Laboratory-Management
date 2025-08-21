import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AdminMain from "./pages/adminmain";
import UpdateLabTime from "./pages/updateslot";
import UpdateSubject from "./components/updatesubject";
import Navbar from "./pages/navbar";
import ProfilePopup from "./components/profile"; 
import React from "react";

function App() {
  // 🔹 Dummy Profile Data
  const dummyProfile = {
    name: "John Doe",
    rollno: "IT2023001",
    department: "Information Technology",
    image: "https://i.pravatar.cc/150?img=3",
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AdminMain />} />
        <Route path="/update-slot" element={<UpdateLabTime />} />
        <Route path="/update-subject" element={<UpdateSubject />} />
        <Route path="/profile" element={<ProfileRoute profile={dummyProfile} />} />
      </Routes>
    </Router>
  );
}

// 🔹 Separate wrapper for profile route
function ProfileRoute({ profile }) {
  const navigate = useNavigate();

  return (
    <ProfilePopup
      show={true} // always show on /profile
      onClose={() => navigate("/")} // go back to home when closed
      profile={profile}
    />
  );
}

export default App;
