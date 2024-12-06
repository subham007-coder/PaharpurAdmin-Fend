import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    console.log('Is Authenticated:', isAuthenticated);

    if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login...');
        return <Navigate to="/login" replace />;
    }

    console.log('Authenticated, rendering protected content...');
    return children;
};

export default ProtectedRoute;