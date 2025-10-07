import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../teacher/teacher-slots.css";
import AdminAppBar from "../../components/Admin_navbar";

function AdminSlots() {
  const [allSlots, setAllSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [Loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    dept: "",
    course: "",
    faculty: "",
    date: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_APP_URL}/Admin/all-slots`
      );
      setAllSlots(response.data.slots || []);
      setFilteredSlots(response.data.slots || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ Handle filter input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Apply filters whenever filters or allSlots change
  useEffect(() => {
    let filtered = [...allSlots];

    if (filters.dept) {
      filtered = filtered.filter(
        (slot) => slot.dept?.toLowerCase() === filters.dept.toLowerCase()
      );
    }
    if (filters.course) {
      filtered = filtered.filter(
        (slot) => slot.Course?.toLowerCase() === filters.course.toLowerCase()
      );
    }
    if (filters.faculty) {
      filtered = filtered.filter(
        (slot) =>
          slot.Staff_name?.toLowerCase() === filters.faculty.toLowerCase()
      );
    }
    if (filters.date) {
      filtered = filtered.filter(
        (slot) =>
          new Date(slot.Date).toISOString().substring(0, 10) === filters.date
      );
    }

    setFilteredSlots(filtered);
  }, [filters, allSlots]);

  const handleDetails = (slotId, dept) => {
    localStorage.setItem("slotid", slotId);
    localStorage.setItem("slotDept", dept);
    navigate("/Admin/students", {
      state: { SlotId: slotId, department: dept },
    });
  };

  const handleClearFilters = () => {
    setFilters({ dept: "", course: "", faculty: "", date: "" });
    setFilteredSlots(allSlots);
  };

  const uniqueDepartments = [...new Set(allSlots.map((s) => s.dept))];
  const uniqueCourses = [...new Set(allSlots.map((s) => s.Course))];
  const uniqueFaculties = [...new Set(allSlots.map((s) => s.Staff_name))];

  return (
    <div>
      <AdminAppBar />

      {Loading && (
        <div style={{ textAlign: "center", padding: "30px" }}>
          <span className="loader"></span>
          <p>Loading data...</p>
        </div>
      )}

      {!Loading && (
        <>
          <h2 style={{ paddingLeft: "20px" }}>All Slots</h2>
          <div className="filter-container">
            <select
              name="dept"
              value={filters.dept}
              onChange={handleFilterChange}
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              name="course"
              value={filters.course}
              onChange={handleFilterChange}
            >
              <option value="">All Courses</option>
              {uniqueCourses.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              name="faculty"
              value={filters.faculty}
              onChange={handleFilterChange}
            >
              <option value="">All Faculty</option>
              {uniqueFaculties.map((f, i) => (
                <option key={i} value={f}>
                  {f}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />

            <button onClick={handleClearFilters}>Clear Filters</button>
          </div>

          {filteredSlots.length === 0 ? (
            <div style={{ textAlign: "center" }}>
              <p>No slots match the selected filters.</p>
            </div>
          ) : (
            <div className="slot-cards">
              {filteredSlots.map((slot, index) => (
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
                    <p>
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
                      {slot?.total_booked || 0}
                    </p>
                    <p>
                      <strong>{slot.venue}</strong>
                    </p>
                    <button
                      className="view-btn"
                      onClick={() => handleDetails(slot._id, slot.dept)}
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
