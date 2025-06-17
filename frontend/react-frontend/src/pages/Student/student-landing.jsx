import React from "react";
import "./student-landing.css";

const CourseList = () => {
  const courses = [
    {
      id: 1,
      name: "COMPUTER SCIENCE",
      faculty: ["Dr. Alice", "Prof. Bob", "Ms. Clara"],
    },
    {
      id: 2,
      name: "MECHANICAL ENGINEERING",
      faculty: ["Mr. Dave", "Dr. Eva", "Prof. Frank"],
    },
    {
      id: 3,
      name: "CIVIL ENGINEERING",
      faculty: ["Ms. Grace", "Dr. Henry", "Prof. Irene"],
    },
  ];

  return (
    <div className="wrapper">
      <div className="course_content">
        <h3 style={{ position: "relative", left: "55px" }}>
          COURSES AVAILABLE
        </h3>
        <div className="allItems">
          {courses.map((course) => (
            <div key={course.id} className="content">
              <h5 style={{ margin: "10px 10px 10px 0px" }}>{course.name}</h5>
              <p style={{ margin: "0px", fontSize: "17px" }}>Faculties:</p>
              <ol className="list_item">
                {course.faculty.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ol>
              <button>View Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseList;
3