import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login/login";
import CourseList from "../pages/Student/student-landing";
import FacultyLanding from "../pages/faculty/faculty-landing";

const AppLayout = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student/dashboard" element={<CourseList />} />
        <Route path="/faculty/dashboard" element={<FacultyLanding/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppLayout;
