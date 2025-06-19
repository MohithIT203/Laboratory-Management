import React from "react";
import AppLayout from "./AppLayout/AppLayout";
import MiniAppBar from "./components/navbar";

const App = () => {
  return (
    <div>
      <MiniAppBar/>
      <AppLayout />
    </div>
  );
};


export default App;
