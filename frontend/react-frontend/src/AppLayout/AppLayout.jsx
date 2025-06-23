import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login/login";
import CourseList from "../pages/Student/student-landing";
import SlotList from "../pages/teacher/teacher-landing";
import StudentAttendance from "../pages/Student/studentAttendance";
import FacultyLanding from "../pages/faculty/faculty-landing";
import Mark_attendance from "../pages/teacher/Attendance/mark_attendance";
import ViewSlots from "../pages/teacher/Attendance/viewSlot";
import MiniAppBar from "../components/navbar";

const AppLayout = () => {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student/dashboard" element={<CourseList />} />
        <Route path="/faculty/dashboard" element={<FacultyLanding />} />
        <Route path="/student" element={<CourseList />} />
        <Route path="/teacher" element={<SlotList />} />
        <Route path="/student_attendance" element={<StudentAttendance />} />
        <Route path="/viewSlot" element={<ViewSlots/>} />
        <Route path="/mark_attendance" element={<Mark_attendance/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppLayout;
