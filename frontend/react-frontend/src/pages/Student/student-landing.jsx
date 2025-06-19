import React, { useEffect, useState } from "react";
import "./student-landing.css";

const CourseList = () => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const savedSlots = localStorage.getItem("createdSlots");
    if (savedSlots) {
      setSlots(JSON.parse(savedSlots));
    }
  }, []);

  return (
    <div className="wrapper">
      <div className="course_content">
        <h3 style={{ marginLeft: "55px" }}>SLOTS AVAILABLE</h3>
        <div className="allItems">
          {slots.length > 0 ? (
            slots.map((slot) => (
              <div key={slot.id} className="content">
                <h5>{slot.title}</h5>
                <p>Date: {slot.date}</p>
                <p>Time: {slot.time}</p>
                <p>Venue: {slot.venue}</p>
                {slot.pdfData && (
                  <p className="pdf-link">
                    📄{" "}
                    <a
                      href={slot.pdfData}
                      download={slot.pdfName}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Material: {slot.pdfName}
                    </a>
                  </p>
                )}
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No slots available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseList;
