import React, { useState ,useEffect} from "react";
import { useLocation } from "react-router-dom";
import "./student-landing.css";
import MiniAppBar from "../../components/navbar";
import axios from 'axios';
const CourseList = () => {
  const location = useLocation();
  const userDept=location.state.Studentdept;
  console.log(userDept);
  // const courses = [
  //   {
  //     id: 1,
  //     name: "COMPUTER SCIENCE",
  //     faculty: ["Dr. Alice", "Prof. Bob", "Ms. Clara"],
  //   },
  //   {
  //     id: 2,
  //     name: "MECHANICAL ENGINEERING",
  //     faculty: ["Mr. Dave", "Dr. Eva", "Prof. Frank"],
  //   },
  //   {
  //     id: 3,
  //     name: "CIVIL ENGINEERING",
  //     faculty: ["Ms. Grace", "Dr. Henry", "Prof. Irene"],
  //   },
  // ];
const [courses,setCourses]=useState([]);


useEffect(() => {
  if (userDept) {
    axios
      .get(`http://localhost:4000/student/courses/${userDept}`)
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch courses:', error);
      });
      
  }
  else{
    alert('Login!!');
  }
}, [userDept]);


  return (
    <>
    <MiniAppBar/>
    <div className="wrapper">
      <div className="course_content">
        <h3 style={{ position: "relative", left: "55px" }}>
          COURSES AVAILABLE
        </h3>
        <div className="allItems">
          {courses.map((course) => (
            <div key={course.Course_id} className="content">
              <h3 style={{ margin: "10px 10px 10px 0px" }}>{course.Course_name}</h3>
              <p style={{ margin: "0px", fontSize: "17px" }}>Faculties:</p>
              <ol className="list_item">
                {course.Staff_name.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ol>
              <button>View Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default CourseList;
3