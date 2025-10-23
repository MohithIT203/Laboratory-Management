import React from "react";
import AppLayout from "./AppLayout/AppLayout";
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div>
       <Toaster position="top-right" reverseOrder={false} />
      <AppLayout />
    </div>
  );
};


export default App;
