import StaffAppBar from "../../components/Staff_navbar";
import React, { useState, useEffect } from "react";
import { useLocation ,useBeforeUnload} from "react-router-dom";
import axios from "axios";
import "./teacher-attendance.css";
import { FaArrowLeft, FaDatabase, FaSpinner } from "react-icons/fa";

const StaffAttendance = () => {
  const location = useLocation();
  const slotId =
    location.state?.slotId || localStorage.getItem("slotid") || "null";

  const [students, setStudents] = useState([]);
  const [otp, setOtp] = useState(null);
  const [timer, setTimer] = useState(0);
  const [showBtn, setshowBtn] = useState(true);
  const [active, setactive] = useState("all");
  const [loading, setLoading] = useState(false); 
  // const [dirty, setDirty] = useState(false); 

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
        `${import.meta.env.VITE_SERVER_APP_URL}/faculty/present-students/${slotId}`
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
        `${import.meta.env.VITE_SERVER_APP_URL}/faculty/absent-students/${slotId}`
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
    setDirty(true);
  };

  const postOtp = async (generatedOtp) => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_APP_URL}/faculty/otp`, {
        slotId,
        otp: generatedOtp,
      });
    } catch (error) {
      console.error("Failed to post Otp", error);
    }
  };

  const handleSaveAllScores = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_APP_URL}/faculty/update-scores/${slotId}`, {
        students: students.map((s) => ({
          _id: s._id,
          score: s.marks,
        })),
      });
      alert("✅ Scores updated successfully!");
    } catch (err) {
      console.error("Error updating scores", err);
      alert(" Failed to update scores!!!");
    }
  };

  const handleGenerateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000);
    setOtp(newOtp);
    // setLoading(true);
    setshowBtn(false);
    postOtp(newOtp);
   
    setTimer(10);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setOtp(null);
          setshowBtn(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
  };
 

  return (
    <div>
      <StaffAppBar />

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

        {/* OTP Block */}
        <div className="otp-card">
          {showBtn && (
            <button className="otp-btn" onClick={handleGenerateOtp}>
              Generate OTP
            </button>
          )}
        
          {otp && (
            <div className="otp-display">
              <p className="otp-value">{otp}</p>
              <p className="otp-timer">Expires in: {timer}s</p>
            </div>
          )}
        </div>

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
                    ({ _id, Student_name, regno, attendance, marks }, index) => (
                      <tr key={_id} className={attendance}>
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
                              value={ marks?? ""}
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
                    <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                      <FaDatabase size={50} style={{ marginBottom: "10px", color: "#aaa" }} />
                      <p>No Data Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            
          </div>
        )}
        {active === "present" && students.length!=0 && (
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
                  // position:"fixed"
                }}
              >
                Save All Scores
              </button>
            )}
      </div>
    </div>
  );
};

export default StaffAttendance;
