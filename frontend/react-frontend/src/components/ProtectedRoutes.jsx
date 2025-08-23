// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials = true;

const ProtectedRoute = ({ allowedRoles }) => {
  const [authorized, setAuthorized] = useState(null);


  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_APP_URL}/auth/verify`);
        if (allowedRoles.includes(res.data.role)) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (err) {
        setAuthorized(false);
      }
    };

    verify();
  }, [allowedRoles]);

  if (authorized === null) return <div style={{position:"relative",alignSelf:"center",justifySelf:"center"}}>Loading...</div>;

  return authorized ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
