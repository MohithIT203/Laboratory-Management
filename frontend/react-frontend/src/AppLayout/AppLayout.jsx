import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login/login";
import CourseList from "../pages/Student/student-landing";
import SlotList from "../pages/teacher/teacher-landing";
import ProtectedRoute from "../components/ProtectedRoutes";
import NotFound from "../pages/Not Found/Notfound";
import StaffSlots from "../pages/teacher/teacher-slots";
import StaffAttendance from "../pages/teacher/teacher-attendance";
import StudentAttendance from "../pages/Student/StudentAttendance";
import SlotSummary from "../pages/teacher/teacher-slotsummary";
import AdminDashboard from "../pages/Admin/Admin-dashboard";
import AdminCourse from "../pages/Admin/Admin-course";
import AdminSlots from "../pages/Admin/Admin-slots";
import AdminAttendance from "../pages/Admin/Admin-students";
import StudentHistory from "../pages/Student/student-history";


const AppLayout = () => {
  return (
    // <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<NotFound/>}></Route>
        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
          <Route path="/student/dashboard" element={<CourseList />} />
          <Route path="/student/attendance" element={<StudentAttendance/>} />
          <Route path="/student/history" element={<StudentHistory/>} />
          
        </Route>

        {/* Protected Faculty Routes */}
        <Route element={<ProtectedRoute allowedRoles={["faculty"]} />}>
          <Route path="/faculty/dashboard" element={<SlotList />} />
          <Route path="/faculty/attendance" element={<StaffSlots/>} />
          <Route path="/faculty/students" element={<StaffAttendance/>} />
          <Route path="/faculty/all-slots" element={<SlotSummary/>} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/Admin/dashboard" element={<AdminDashboard/>} />
          <Route path="/Admin/Users" element={<AdminDashboard/>} />
          <Route path="/Admin/courses" element={<AdminCourse/>} />
          <Route path="/Admin/all-slots" element={<AdminSlots/>} />
          <Route path="/Admin/students" element={<AdminAttendance/>} />
        </Route>
      </Routes>
    // </BrowserRouter>
  );
};

export default AppLayout;