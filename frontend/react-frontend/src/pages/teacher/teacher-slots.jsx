import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import StaffAppBar from "../../components/Staff_navbar";
import "./teacher-slots.css";

function StaffSlots() {
  const [allSlots, setallSlots] = useState([]);
  const [Students, setStudents] = useState([]);
  const navigate=useNavigate();

  const FacultyEmail =
    location.state?.FacultyEmail || localStorage.getItem("FacultyEmail");
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/faculty/my-slots/${FacultyEmail}`
        );
        setallSlots(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    if (FacultyEmail) fetchCourses();
  }, []);
const handleDetails=async (slotId)=>{
      localStorage.setItem("slotid",slotId);
      navigate('/faculty/students',{ state: { SlotId:slotId}});
}
  return (
    <div>
      <StaffAppBar />
        <h2 style={{
          paddingLeft:"20px"
        }}>All Slots</h2>
      <div className="slot-cards">
        {allSlots.map((slot, index) => (
          <div key={index} className="slot">
            <img
              src="https://media.istockphoto.com/id/1294693719/vector/illustration-of-person-working-in-tidy-modern-office.webp?b=1&s=612x612&w=0&k=20&c=xvbdMGTJRuMGWMdpxMllz4CJI5vXU8XFMVb75eG1uYo="
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
              <p
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "200px",
                }}
              >
                <strong>Course : </strong>
                {slot.Course}
              </p>
              <p>
                <strong>Exp.No : </strong>
                {slot.experiment.exp_no}
              </p>
              <p>
                <strong>Date : </strong>
                {new Date(slot.Date).toISOString().substring(0, 10)}
              </p>

              <p>
                <strong>Time : </strong>
                {slot.Time}
              </p>
              <p>
                <strong>Total Students : </strong>
                {slot.booked_students.length}
              </p>
              <p>
                <strong>{slot.venue}</strong>
              </p>
              <button className="view-btn"
                onClick={()=>handleDetails(slot._id)}
              >View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StaffSlots;
