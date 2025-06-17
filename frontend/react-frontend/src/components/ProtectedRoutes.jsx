import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
// import Spinner from './Spinner'; // Import spinner

axios.defaults.withCredentials = true; 

function ProtectedRoute({ allowedRoles, children }) {
    const [authorized, setAuthorized] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:4000/auth/verify')
            .then(res => {
                if (allowedRoles.includes(res.data.role)) {
                    setAuthorized(true);
                } else {
                    setAuthorized(false);
                }
            })
            .catch(() => setAuthorized(false));
    }, []);

    if (authorized === null) return ;

    return authorized ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
