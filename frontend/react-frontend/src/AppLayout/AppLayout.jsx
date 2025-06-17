import React from "react";
import Login from "../pages/login/login";
import MiniAppBar from "../components/navbar";
import { Route, Routes } from "react-router-dom";
import CourseList from "../pages/Student/student-landing";

const AppLayout = () => {
  return (
    <>
    <Login/>
    <Routes>
      <Route path="/student-dashboard" element={<CourseList/>}></Route>
    </Routes>
    </>
  );
};

export default AppLayout;
