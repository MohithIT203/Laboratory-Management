import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../teacher/teacher-attendance.css";
import "./Admin-students.css";
import { FaArrowLeft, FaDatabase, FaPlus } from "react-icons/fa";
import AdminAppBar from "../../components/Admin_navbar";

const AdminAttendance = () => {
  const location = useLocation();
  const slotId =
    location.state?.slotId || localStorage.getItem("slotid") || "null";
  const userDept =
    location.state?.department || localStorage.getItem("slotDept") || "null";

  const [students, setStudents] = useState([]);
  const [active, setactive] = useState("all");
  const [Addpopup, setAddPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [Addselected, setAddSelected] = useState([]);
  const [AddStudents, setAddStudents] = useState([]);

  const style = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90vw", sm: 400 },
    maxHeight: "80vh",
    overflowY: "auto",
    bgcolor: "background.paper",
    border: "0px solid #000",
    boxShadow: 24,
    p: 3,
    borderRadius: "8px",
    fontFamily: "Inter, sans-serif",
  };

  
  const fetchStudents = async () => {
    setactive("all");
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_APP_URL}/faculty/students/${slotId}`
      );
      setStudents(response.data.students);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slotId) {
      fetchStudents();
    }
  }, [slotId]);

  const handlePresentTab = async () => {
    setactive("present");
    setLoading(true);
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_SERVER_APP_URL
        }/faculty/present-students/${slotId}`
      );
      setStudents(res.data.students);
    } catch (err) {
      console.error("Error fetching present students", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAbsentTab = async () => {
    setactive("absent");
    setLoading(true);
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_SERVER_APP_URL
        }/faculty/absent-students/${slotId}`
      );
      setStudents(res.data.students);
    } catch (err) {
      console.error("Error fetching absent students", err);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (_id, value) => {
    setStudents((prev) =>
      prev.map((stu) => (stu._id === _id ? { ...stu, marks: value } : stu))
    );
  };

  const handleSaveAllScores = async () => {
    try {
      await axios.put(
        `${
          import.meta.env.VITE_SERVER_APP_URL
        }/faculty/update-scores/${slotId}`,
        {
          students: students.map((s) => ({
            _id: s._id,
            score: s.marks,
          })),
        }
      );
      alert("✅ Scores updated successfully!");
    } catch (err) {
      console.error("Error updating scores", err);
      alert(" Failed to update scores!!!");
    }
  };

  const handleCheckbox = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAddStudents = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_APP_URL
        }/Admin/add-students/${userDept}/${slotId}`
      );
      setAddStudents(response.data);
    } catch (err) {
      console.error("Error Fetching Students");
    }
  };

  const handleSelectedAdd = (id) => {
    setAddSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };
  const handleAddStudentsSubmit=async (e)=>{
    e.preventDefault();
   
    setAddPopup(false);
     try {
      if (!Addselected.length > 0) {
        return alert("select Any Users");
      }
      await axios.put(
        `${
          import.meta.env.VITE_SERVER_APP_URL
        }/Admin/add-students/${slotId}`,
        {
          students: Addselected,
        }
      );
      fetchStudents();
    } catch (err) {
      console.error("Error Updating Attendance!!");
    }
  }
  const handleSelectAll = () => {
    if (selected.length === students.length) {
      setSelected([]);
    } else {
      setSelected(students.map((s) => s._id));
    }
  };

  const handleUpdateAttendance = async () => {
    try {
      if (!selected.length > 0) {
        return alert("select Any Users");
      }
      await axios.put(
        `${
          import.meta.env.VITE_SERVER_APP_URL
        }/faculty/update-attendance/${slotId}`,
        {
          students: selected,
        }
      );
      fetchStudents();
    } catch (err) {
      console.error("Error Updating Attendance!!");
    }
  };

  return (
    <div>
      <AdminAppBar />
      <div className="mark-attendance-container">
        <p>
          <FaArrowLeft
            alt="back"
            onClick={() => window.history.back()}
            style={{
              cursor: "pointer",
              color: "green",
              position: "relative",
              width: "25px",
              height: "20px",
            }}
          />
        </p>
        <h2 className="mark-attendance-title">
          Mark Attendance & Scores for: {slotId || "Unknown Slot"}
        </h2>
        {/* Tabs */}
        <div className="options">
          <div>
            <button
              className={active === "all" ? "tab-btn active" : "tab-btn"}
              onClick={fetchStudents}
            >
              All
            </button>
            <button
              className={active === "present" ? "tab-btn active" : "tab-btn"}
              onClick={handlePresentTab}
            >
              Present
            </button>
            <button
              className={active === "absent" ? "tab-btn active" : "tab-btn"}
              onClick={handleAbsentTab}
            >
              Absent
            </button>
          </div>
          <div
            className="addStudents"
            onClick={() => {
              setAddPopup(true), handleAddStudents();
            }}
          >
            <button className="add-students">
              <FaPlus
                style={{
                  position: "relative",
                  top: "2px",
                  color: "green",
                }}
                onClick={() => {
                  setAddPopup(true);
                }}
              />{" "}
              Add Students
            </button>
          </div>
        </div>

        {/* Table or Loader */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "30px" }}>
            <span className="loader"></span>
            <p>Loading data...</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="attendance-table">
              {students?.length > 0 && (
                <thead style={{
                  position:"sticky",
                  top:"0"
                }}>
                  <tr>
                    {active !== "all" && (
                      <th>
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={
                            students.length > 0 &&
                            selected.length === students.length
                          }
                        />
                      </th>
                    )}
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Reg No</th>
                    {active !== "all" && <th>Attendance</th>}
                    {active !== "all" && <th>Score</th>}
                  </tr>
                </thead>
              )}
              <tbody>
                {students.length !== 0 ? (
                  students.map(
                    (
                      { _id, Student_name, regno, attendance, marks },
                      index
                    ) => (
                      <tr key={_id} className={attendance}>
                        {active !== "all" && (
                          <td>
                            <input
                              type="checkbox"
                              checked={selected.includes(_id)}
                              onChange={() => handleCheckbox(_id)}
                            />
                          </td>
                        )}
                        <td>{index + 1}</td>
                        <td>{Student_name?.toUpperCase() || "N/A"}</td>
                        <td>{regno || "N/A"}</td>
                        {active !== "all" && (
                          <td
                            className={`attendance-btn ${
                              attendance?.toLowerCase() === "present"
                                ? "present"
                                : "absent"
                            }`}
                          >
                            {attendance?.toUpperCase() || "N/A"}
                          </td>
                        )}
                        {active !== "all" && (
                          <td>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={marks ?? ""}
                              onChange={(e) =>
                                handleScoreChange(_id, e.target.value)
                              }
                              className="score-input"
                              placeholder="0-100"
                            />
                          </td>
                        )}
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#888",
                      }}
                    >
                      <FaDatabase
                        size={50}
                        style={{ marginBottom: "10px", color: "#aaa" }}
                      />
                      <p>No Data Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
              
            </table>

            {/* Action Buttons */}
           
           
           
             
          </div>
        )}
          {active === "absent" && students.length > 0 && (
              <>
                <button
                  className="save-btn"
                  style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "orange",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  
                  }}
                  onClick={handleUpdateAttendance}
                >
                  Mark Selected Present
                </button>
              </>
            )}
            {active === "present" && (
              <button
                className="save-btn"
                onClick={handleSaveAllScores}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  position: "fixed",
                }}
              >
                Save All Scores
              </button>
              
            )}
      </div>

      <Modal open={Addpopup} onClose={() => setAddPopup(false)}>
        <Box sx={style}>
          <form onSubmit={handleAddStudentsSubmit}>
            <div className="popup">
              <h2>Add Students</h2>
              {/* <label>Department:{userDept}</label> */}
              {AddStudents.map((student, index) => (
                <label key={index}>
                <div key={index} className="AddStudents">
                  
                  <div className="AddStudents-input">
                    
                    <input
                      type="checkbox"
                      style={{
                        height: "40px",
                        width: "20px",
                        position: "relative",
                        alignSelf: "center",
                      }}
                      checked={Addselected.includes(student._id)}
                              onChange={() => handleSelectedAdd(student._id)}
                    />

                  </div>
                  
                  <div>
                    <p>
                      <strong>Name</strong>:{" "}
                      {student.Student_name.toUpperCase()}
                    </p>
                    <p>
                      <strong>Reg.No </strong>: {student.regno}
                    </p>
                  </div>
              

                </div>
                  </label>
              ))}
              <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                <button type="submit">Confirm</button>
                <button
                  type="button"
                  onClick={() => {
                    setAddPopup(false);
                  }}
                  style={{ backgroundColor: "#ccc", color: "#333" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminAttendance;
