import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login/login";
import CourseList from "../pages/Student/student-landing";
import SlotList from "../pages/teacher/teacher-landing";
import ProtectedRoute from "../components/ProtectedRoutes";
import NotFound from "../pages/Not Found/Notfound";


const AppLayout = () => {
  return (
    // <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<NotFound/>}></Route>
        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
          <Route path="/student/dashboard" element={<CourseList />} />
        </Route>

        {/* Protected Faculty Routes */}
        <Route element={<ProtectedRoute allowedRoles={["faculty"]} />}>
          <Route path="/faculty/dashboard" element={<SlotList />} />
        </Route>
      </Routes>
    // </BrowserRouter>
  );
};

export default AppLayout;