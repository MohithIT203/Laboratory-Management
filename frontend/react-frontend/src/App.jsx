import React from "react";
import AppLayout from "./AppLayout/AppLayout";
import MiniAppBar from "./components/navbar";
import SlotList from "./pages/teacher/teacher-landing";
import StudentAttendance from "./pages/Student/studentAttendence";
// import BasicModal from "./AppLayout/modal";

const App = () => {
  return (
    <div>
      {/* <MiniAppBar/> */}
      <AppLayout />
      {/* <StudentAttendance/> */}
      {/* <BasicModal/> */}
      {/* <SlotList/> */}
    </div>
  );
};


export default App;
