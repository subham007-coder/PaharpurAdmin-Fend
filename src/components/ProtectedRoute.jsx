import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated }) => {
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShouldRedirect(true); // Trigger the redirect if not authenticated
    }
  }, [isAuthenticated]); // Only run this effect when isAuthenticated changes

  if (shouldRedirect) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
