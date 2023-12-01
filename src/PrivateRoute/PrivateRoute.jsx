import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Get the JWT token from local storage
    const location = useLocation();

    return token ? children : <Navigate to="/dashboard" state={{ from: location }} replace />;
};

export default PrivateRoute;
