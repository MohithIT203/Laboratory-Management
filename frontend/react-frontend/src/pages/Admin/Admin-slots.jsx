import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../teacher/teacher-slots.css";
import AdminAppBar from "../../components/Admin_navbar";

function AdminSlots() {
  const [allSlots, setAllSlots] = useState([]);
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_APP_URL}/Admin/all-slots`
        );
        setAllSlots(response.data.slots);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
         fetchCourses();
  }, []);

  const handleDetails = (slotId,dept) => {
    localStorage.setItem("slotid", slotId);
    localStorage.setItem("slotDept", dept);
    navigate("/Admin/students", { state: { SlotId: slotId,deptartment:dept} });
  };

  return (
    <div>
      <AdminAppBar/>

      {Loading && (
        <div style={{ textAlign: "center", padding: "30px" }}>
          <span className="loader"></span>
          <p>Loading data...</p>
        </div>
      )}

      {!Loading && (
        <>
          <h2 style={{ paddingLeft: "20px" }}>All Slots</h2>

          {allSlots.length === 0 ? (
            <div style={{ textAlign: "center", justifySelf:"center",alignSelf:"center"}}>
              <p>No slots found for this faculty.</p>
            </div>
          ) : (
            <div className="slot-cards">
              {allSlots.map((slot, index) => (
                <div key={index} className="slot">
                  <img
                    src="https://media.istockphoto.com/id/1294693719/vector/illustration-of-person-working-in-tidy-modern-office.webp?b=1&s=612x612&w=0&k=20&c=xvbdMGTJRuMGWMdpxMllz4CJI5vXU8XFMVb75eG1uYo="
                    alt="Slot"
                    style={{
                      height: "200px",
                      width: "100%",
                      maxWidth: "300px",
                      objectFit: "cover",
                      borderTopLeftRadius: "1rem",
                      borderTopRightRadius: "1rem",
                    }}
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
                      <strong>Staff : </strong>
                       {slot.Staff_name}
                    </p>
                    <p>
                      <strong>Department : </strong>
                      {slot.dept}
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
                      {slot.total_booked}
                    </p>
                    <p>
                      <strong>{slot.venue}</strong>
                    </p>
                    <button
                      className="view-btn"
                      onClick={() => handleDetails(slot._id,slot.dept)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminSlots;
