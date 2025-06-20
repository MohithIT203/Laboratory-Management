import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login/login";
import CourseList from "../pages/Student/student-landing";
import SlotList from "../pages/teacher/teacher-landing";
import StudentAttendance from "../pages/Student/studentAttendance";

const AppLayout = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<CourseList />} />
        <Route path="/teacher" element={<SlotList />} />
        <Route path="/attendance-student" element={<StudentAttendance/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppLayout;
