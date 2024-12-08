import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated }) => {

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children; // Render children if authenticated
};

export default ProtectedRoute;
