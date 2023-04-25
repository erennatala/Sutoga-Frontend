import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const location = useLocation();

    return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
